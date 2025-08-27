import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h1 className="text-5xl font-bold text-red-600">Oops!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Sorry, something went wrong.
      </p>
      <p className="mt-2 text-gray-500 italic">
        {error.statusText || error.message}
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        Go Home
      </a>
    </div>
  );
};

export default ErrorPage;
