import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance"; // your axios instance

export default function Todos() {
  const modalRef = useRef();
  const queryClient = useQueryClient();

  // form setup
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // mutation hook for adding a new todo
  const { mutate: createNewTodo } = useMutation({
    mutationKey: ["newTodo"],
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]); // refetch todos on success
    },
  });

  // fetch all todos on component mount
  const { data, isError, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();
      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      return data;
    },
  });

  // toggle modal open/close
  const toggleNewTodoModal = () => {
    if (modalRef.current.open) {
      modalRef.current.close();
    } else {
      modalRef.current.showModal();
    }
  };

  // handle form submit
  const handleNewTodo = (values) => {
    createNewTodo(values);
    toggleNewTodoModal();
    reset(); // clear form
  };

  // show loading indicator
  if (isLoading) {
    return <div>Loading Todos...</div>;
  }

  // show error indicator
  if (isError) {
    return <div>There was an error loading your todos.</div>;
  }

  // button to open modal
  function NewTodoButton() {
    return (
      <button className="btn btn-primary" onClick={toggleNewTodoModal}>
        New Todo
      </button>
    );
  }

  // modal with form
  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name")}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button
                type="button"
                onClick={toggleNewTodoModal}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }

  // new component to display todo items
  function TodoItemList() {
    return (
      <div className="w-lg h-sm flex column items-center justify-center gap-4">
        {data.success && data.todos && data.todos.length >= 1 ? (
          <ul className="flex column items-center justify-center gap-4">
            {data.todos.map((todo) => (
              <li key={todo.id} className="inline-flex items-center gap-4">
                <div className="w-md">
                  <h3 className="text-lg">{todo.name}</h3>
                  <p className="text-sm">{todo.description}</p>
                </div>
                <div className="w-md">
                  <label className="swap">
                    <input
                      type="checkbox"
                      onClick={() => markAsCompleted(todo.id)}
                    />
                    <div className="swap-on">Yes</div>
                    <div className="swap-off">No</div>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // if no data or empty array, fallback UI
          <div className="text-center mt-4">
            <p>No todos yet — click “New Todo” to add one!</p>
          </div>
        )}
      </div>
    );
  }

  // placeholder function for marking completed
  function markAsCompleted(todoId) {
    console.log(`Marking todo ${todoId} as completed — implement later!`);
  }

  // final render
  return (
    <>
      <NewTodoButton />
      <TodoItemList /> {/* render list between button and modal */}
      <TodoModal />
    </>
  );
}
