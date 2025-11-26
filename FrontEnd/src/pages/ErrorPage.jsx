import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="errorPageContainer">
      <h1 >ERROR 404</h1>
      <br />
      You can go back to the home page by clicking
      <Link to="/" className="text-blue-700 underline">
        here
      </Link>
    </div>
  );
};

export default ErrorPage;
