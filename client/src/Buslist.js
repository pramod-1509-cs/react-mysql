import React, { useState } from "react";
import axios from "axios";
import "./Buslist.css";

const BusList = () => {
  const [busId, setBusId] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [timming, setTimming] = useState("");
  const [busIdToUpdate, setBusIdToUpdate] = useState("");
  const [passengersList, setPassengersList] = useState([]);
  const [busList, setBusList] = useState([]);

  const handleBusSearch = () => {
    axios
      .get(
        `http://localhost:5000/api/buses?source=${source}&destination=${destination}`
      )
      .then((response) => {
        setBusList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bus list:", error);
      });
  };
  const handleFetchPassengers = () => {
    if (!busIdToUpdate) {
      console.error("Bus ID is required to fetch passengers.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/passengers/${busIdToUpdate}`)
      .then((response) => {
        setPassengersList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching passengers:", error);
      });
  };
  const handleUpdate = () => {
    if (!busIdToUpdate) {
      console.error("Bus ID to update is required.");
      return;
    }

    axios
      .put(`http://localhost:5000/api/buses/${busIdToUpdate}`, {
        source,
        destination,
        timming,
      })
      .then((response) => {
        console.log(response.data);

        axios
          .get(
            `http://localhost:5000/api/buses?source=${source}&destination=${destination}`
          )
          .then((response) => {
            setBusList(response.data);
          })
          .catch((error) => {
            console.error("Error fetching updated list of buses:", error);
          });

        setSource("");
        setDestination("");
        setTimming("");
        setBusIdToUpdate("");
      })
      .catch((error) => {
        console.error("Error updating bus details:", error);
      });
  };

  const handleDelete = () => {
    if (!busIdToUpdate) {
      console.error("Bus ID to delete is required.");
      return;
    }

    axios
      .delete(`http://localhost:5000/api/buses/${busIdToUpdate}`)
      .then((response) => {
        console.log(response.data);

        axios
          .get(
            `http://localhost:5000/api/buses?source=${source}&destination=${destination}`
          )
          .then((response) => {
            setBusList(response.data);
          })
          .catch((error) => {
            console.error("Error fetching updated list of buses:", error);
          });

        setSource("");
        setDestination("");
        setTimming("");
        setBusIdToUpdate("");
      })
      .catch((error) => {
        console.error("Error deleting bus record:", error);
      });
  };

  const handleAddBus = () => {
    if (!busId || !source || !destination || !timming) {
      console.error("Bus ID, Source, Destination, and Timing are required.");
      return;
    }

    const isBusExists = busList.some(
      (bus) => bus.bus_id === parseInt(busId, 10)
    );
    console.log("isBusExists:", isBusExists);

    if (isBusExists) {
      console.error("Bus with the same bus_id already exists");
      console.log("Alert: Bus with the same bus_id already exists");
      alert("Bus with the same bus_id already exists");
      return;
    }

    axios
      .post("http://localhost:5000/api/buses", {
        busId,
        source,
        destination,
        timming,
      })
      .then((response) => {
        console.log(response.data);

        // Optionally, you can fetch the updated list of buses
        axios
          .get("http://localhost:5000/api/buses")
          .then((response) => {
            setBusList(response.data);
          })
          .catch((error) => {
            console.error("Error fetching updated list of buses:", error);
          });

        // Clear the form fields
        setBusId("");
        setSource("");
        setDestination("");
        setTimming("");
      })
      .catch((error) => {
        console.error("Error adding bus:", error.response.data.error);
      });
  };

  return (
    <div className="bus-list-container">
      <h1 className="bus-list-header">Bus List</h1>
      <label className="form-label">
        Source:
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="form-input"
        />
      </label>
      <label className="form-label">
        Destination:
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="form-input"
        />
      </label>
      <button onClick={handleBusSearch} className="form-button">
        Search Buses
      </button>
      <ul className="bus-list">
        {busList.map((bus) => (
          <li key={bus.bus_id} className="bus-item">
            <strong>Source:</strong> {bus.source}, <strong>Destination:</strong>{" "}
            {bus.destination}, <strong>Timing:</strong> {bus.timming}
          </li>
        ))}
      </ul>
      <h1 className="bus-list-header">Update Bus Record</h1>
      <label className="form-label">
        Bus ID to Update:
        <input
          type="number"
          value={busIdToUpdate}
          onChange={(e) => setBusIdToUpdate(e.target.value)}
          className="form-input"
        />
      </label>
      <br />
      <label className="form-label">
        New Source:
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="form-input"
        />
      </label>
      <br />
      <label className="form-label">
        New Destination:
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="form-input"
        />
      </label>
      <br />
      <label className="form-label">
        New Timing:
        <input
          type="text"
          value={timming}
          onChange={(e) => setTimming(e.target.value)}
          className="form-input"
        />
      </label>
      <br />
      <button onClick={handleUpdate} className="form-button">
        Update Bus Details
      </button>
      <h1 className="bus-list-header">Delete Bus Record</h1>
      <label className="form-label">
        Bus ID to Delete:
        <input
          type="number"
          value={busIdToUpdate}
          onChange={(e) => setBusIdToUpdate(e.target.value)}
          className="form-input"
        />
      </label>
      <br />
      <button onClick={handleDelete} className="form-button">
        Delete Bus Record
      </button>
      <h1 className="bus-list-header">Display Passenger</h1>
      <label className="form-label">
        Bus ID to Fetch Passengers:
        <input
          type="number"
          value={busIdToUpdate}
          onChange={(e) => setBusIdToUpdate(e.target.value)}
          className="form-input"
        />
      </label>
      <button onClick={handleFetchPassengers} className="form-button">
        Fetch Passengers
      </button>

      <ul className="passengers-list">
        {passengersList.map((passenger) => (
          <li key={passenger.passenger_id} className="passenger-item">
            <strong>Name:</strong> {passenger.name}
          </li>
        ))}
      </ul>
      <h1 className="bus-list-header">Add Bus </h1>
      <form className="bus-form">
        <label className="form-label">
          Bus ID:
          <input
            type="number"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Source:
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Destination:
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Timing:
          <input
            type="text"
            value={timming}
            onChange={(e) => setTimming(e.target.value)}
            className="form-input"
          />
        </label>
        <br />
        <button type="button" onClick={handleAddBus} className="form-button">
          Add Bus
        </button>
      </form>
    </div>
  );
};

export default BusList;
