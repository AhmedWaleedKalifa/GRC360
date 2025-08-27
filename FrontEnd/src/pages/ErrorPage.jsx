import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[700px]">
        <h1 className="text-teal font-extrabold text-6xl">ERROR 404</h1>
        <br />
      <Link to="/" className="text-blue-500">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default ErrorPage;
