import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="errorPageContainer">
      <h1 >ERROR 404</h1>
      <br />
      <Link to="/" >
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default ErrorPage;
