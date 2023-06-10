import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function LoginModal({ modalRef, setIsModalOpen }) {
  const { username, setUsername, password, setPassword, handleAccess, error } =
    useContext(AuthContext);

  return (
    <dialog
      className="z-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:hidden border-2 overflow-visible m-0 rounded shadow-md"
      ref={modalRef}
    >
      {" "}
      <div
        className="absolute top-2 right-3 cursor-pointer"
        onClick={() => {
          modalRef.current.close();
          setIsModalOpen(false);
        }}
      >
        &#10799;
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleAccess}>
        <h3 className="underline">Login</h3>
        <label
          htmlFor="login-username"
          className="flex justify-between items-center gap-3"
        >
          Username:
          <input
            className="border-2 border-slate-400 px-4 py-2 rounded-lg w-80"
            type="text"
            name="login-username"
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label
          htmlFor="login-password"
          className="flex justify-between items-center gap-3"
        >
          Password:
          <input
            className="border-2 border-slate-400 px-4 py-2 rounded-lg w-80"
            type="password"
            name="login-password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="border-2 border-slate-400 px-6 py-2 rounded-lg self-center hover:bg-stone-100">
          LogIn
        </button>
      </form>
      {error && (
        <div className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-lg self-center mt-3">
          {error}
        </div>
      )}
    </dialog>
  );
}

LoginModal.propTypes = {
  modalRef: PropTypes.object.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};
