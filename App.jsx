import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Spring Boot backend!");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      salary: Number(formData.salary)
    };

    try {
      const response = await fetch(
          editingId
              ? `${API_URL}/${editingId}`
              : API_URL,
          {
            method: editingId ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeData)
          }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      alert(
          editingId
              ? "Employee updated successfully!"
              : "Employee added successfully!"
      );

      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary
    });

    setEditingId(employee.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Unable to delete employee!");
    }
  };

  return (
      <div className="app">
        <header className="header">
          <h1>Employee Management System</h1>
          <p>Manage your employees easily</p>
        </header>

        <main className="container">
          <section className="card">
            <h2>
              {editingId ? "Update Employee" : "Add New Employee"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">

                <div className="form-group">
                  <label>Name</label>
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>Salary</label>
                  <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      required
                  />
                </div>

              </div>

              <div className="buttons">
                <button type="submit" className="primary-btn">
                  {editingId ? "Update Employee" : "Add Employee"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={resetForm}
                    >
                      Cancel
                    </button>
                )}
              </div>
            </form>
          </section>

          <section className="card">
            <div className="list-header">
              <div>
                <h2>Employee List</h2>
                <p>Total Employees: {employees.length}</p>
              </div>

              <button
                  className="refresh-btn"
                  onClick={fetchEmployees}
              >
                Refresh
              </button>
            </div>

            {employees.length === 0 ? (
                <div className="empty">
                  <h3>No Employees Found</h3>
                  <p>Add your first employee above.</p>
                </div>
            ) : (
                <div className="table-container">
                  <table>
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Salary</th>
                      <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.id}</td>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>{employee.phone}</td>
                          <td>{employee.department}</td>
                          <td>{employee.designation}</td>
                          <td>₹{employee.salary}</td>
                          <td>
                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(employee.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </section>
        </main>
      </div>
  );
}

export default App;