import { faFile, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import { DeleteFile } from "./DeleteFile";

export default function File({ file }) {
  async function handleDelete() {
    if (window.confirm(`Delete "${file.name}"?`)) {
      try {
        await DeleteFile(file);
        toast.success("File deleted!");
      } catch (error) {
        toast.error("Failed to delete.");
        console.error(error);
      }
    }
  }

  function handleProperties() {
    toast.info(
      `Name: ${file.name}\nCreated: ${
        file.createdAt?.toDate?.().toLocaleString?.() || "N/A"
      }`
    );
  }

  return (
    <div
      className="d-flex justify-content-between align-items-center bg-light border rounded px-3 py-2 mb-3 shadow-sm"
      style={{ maxWidth: "500px" }}
    >
      <div className="d-flex align-items-center text-truncate" style={{ gap: "0.5rem" }}>
        <FontAwesomeIcon icon={faFile} className="text-secondary" />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-truncate text-decoration-none text-dark"
        >
          {file.name}
        </a>
      </div>

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="light"
          className="btn-sm border-0 shadow-none"
          style={{ backgroundColor: "transparent" }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleProperties}>View Properties</Dropdown.Item>
          <Dropdown.Item onClick={handleDelete} className="text-danger">
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
