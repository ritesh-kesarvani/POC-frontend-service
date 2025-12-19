import "./Projects.css";
import ProjectTable from "../../components/projectTable/ProjectTable";

function Projects() {
  return (
    <>
      <div className="table-top d-flex justify-content-between">
        <h1 className="m-0">
          Projects
        </h1>

      </div>

      <ProjectTable  />
    </>
  );
}

export default Projects;
