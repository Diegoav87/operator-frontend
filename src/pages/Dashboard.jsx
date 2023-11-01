import Typewriter from "typewriter-effect";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./style.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const words = [""];
// let text =
//   "¡Ayuda! Hay fuego, necesitamos asistencia urgente. ¡Arma! Ha habido un accidente grave, y hay sangre por todas partes. Por favor, envíen ayuda de inmediato al";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    summary: "",
    date: "",
  });

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [text, setText] = useState("");
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [audioFile, setAudioFile] = useState(null);

  const [notas, setNotas] = useState([]);
  const [notaActual, setNotaActual] = useState("");

  const handleFileChange = (e) => {
    // Capture the selected file
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const agregarNota = () => {
    if (notaActual.trim() !== "") {
      setNotas([...notas, notaActual]);
      setNotaActual("");
    }
  };

  const fetchData = () => {
    if (!audioFile) {
      alert("Please select an audio file.");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("audio", audioFile); // Append the selected audio file

    // Make a POST request to your Flask API with the FormData
    fetch("https://operatorbackend.up.railway.app/call", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let newText = data["text"];

        const splitted = newText.split(/\s+|[,.;!?]+/);

        splitted.forEach((word) => {
          let newWord = word;

          if (data["keys"].includes(word.toLowerCase())) {
            newWord =
              "<span style='color: rgb(239 68 68); font-weight: bold'>" +
              word +
              "</span>";
            newText = newText.replace(new RegExp(word, "g"), newWord);
          }
        });

        console.log(newText);

        setText(newText);
        setTypewriterKey((prevKey) => prevKey + 1);

        setFormData({
          ...formData,
          summary: data["summary"],
          date:
            data["date"] +
            " " +
            data["hour"].replace(new RegExp("_", "g"), ":"),
        });

        data["popup"].forEach((popup) => {
          if (serviciosIniciales.includes(popup["peligro"])) {
            handleAddServicio(popup["peligro"]);
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const sendFile = () => {
    fetchData();
  };

  const serviciosIniciales = [
    "Despachar Ambulancia",
    "Despachar Policía",
    "Despachar Bomberos",
    "Despachar Protección Civil",
  ];
  const [serviciosDisponibles, setServiciosDisponibles] =
    useState(serviciosIniciales);
  const [selectedServicios, setSelectedServicios] = useState(new Set());
  const [inputValue, setInputValue] = useState("");

  const handleAddServicio = (servicio) => {
    setSelectedServicios(new Set([...selectedServicios, servicio]));
    setServiciosDisponibles(serviciosDisponibles.filter((s) => s !== servicio));
  };

  const handleRemoveServicio = (servicio) => {
    selectedServicios.delete(servicio);
    setSelectedServicios(new Set(selectedServicios));
    setServiciosDisponibles([...serviciosDisponibles, servicio]);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddCustomServicio = () => {
    if (inputValue.trim() !== "") {
      const servicio = inputValue.trim();
      setSelectedServicios(new Set([...selectedServicios, servicio]));
      setServiciosDisponibles([...serviciosDisponibles, servicio]);
      setInputValue("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
        <figure className="flex flex-col items-start justify-start p-8 text-left bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="user_avatar"
          >
            Subir archivo de audio
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-8"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
            onChange={handleFileChange}
          />
          <button
            onClick={sendFile}
            className="text-white inline-flex items-left bg-blue-700 hover-bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800 mb-8"
          >
            Enviar Archivo
          </button>
          <AudioPlayer
            autoPlay
            src={audioFile ? URL.createObjectURL(audioFile) : ""}
            onPlay={(e) => console.log("onPlay")}
            autoPlayAfterSrcChange={false}
            autoPlay={false}
            // other props here
          />
          <div className="mb-8"></div>
          <blockquote className="mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
            <h3 className="text-lg mb-4 font-semibold text-gray-900 dark:text-white">
              Texto
            </h3>
            <a
              href="#"
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <p className="my-4">
                <Typewriter
                  key={typewriterKey}
                  options={{
                    delay: 50,
                  }}
                  onInit={(typewriter) => {
                    typewriter.typeString(text).pauseFor(1000).start();
                  }}
                />
              </p>
            </a>
          </blockquote>
        </figure>
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
          <blockquote className="w-full mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
            <label
              htmlFor="countries"
              className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              Nivel de prioridad
            </label>
            <select
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
            >
              <option>Nivel 1</option>
              <option>Nivel 2</option>
              <option>Nivel 3</option>
            </select>

            <div className="max-w-md mx-auto p-4 bg-white rounded shadow mb-4">
              <h2 className="text-2xl font-bold mb-4">Servicios Necesarios</h2>

              <div>
                <p className="font-semibold mb-2">Seleccionados:</p>
                <ul>
                  {Array.from(selectedServicios).map((servicio, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      {servicio}
                      <button
                        onClick={() => handleRemoveServicio(servicio)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold my-2">Disponibles:</p>
                <ul>
                  {serviciosDisponibles.map((servicio, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between mb-2"
                    >
                      {servicio}
                      <button
                        onClick={() => handleAddServicio(servicio)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Agregar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <label
              htmlFor="small-input"
              className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              Fecha y Hora de Registro
            </label>
            <input
              type="text"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              value={formData.date}
              onChange={handleInputFormChange}
            />
            <label
              htmlFor="message"
              className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              Resumen de Reporte
            </label>
            <textarea
              id="summary"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
              placeholder="Resumen de Reporte..."
              onChange={handleInputFormChange}
              value={formData.summary}
              name="summary"
            ></textarea>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
              >
                Notas
              </label>
              <textarea
                id="message"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                placeholder="Nota..."
                value={notaActual}
                onChange={(e) => setNotaActual(e.target.value)}
              ></textarea>
              <div className="text-left">
                <button
                  onClick={agregarNota}
                  className="text-white inline-flex items-left bg-blue-700 hover-bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="mr-1 -ml-1 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Agregar Nota
                </button>
              </div>
              <div>
                <h2>Notas guardadas:</h2>
                <div className="row">
                  {notas.map((nota, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card">
                        <p>{nota}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </blockquote>
        </figure>
      </div>
    </>
  );
}
