import Navbar from "../components/Navbar";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

export default function Keywords() {
  const [formData, setFormData] = useState({
    key1: "",
    key2: "",
    popup: "Despachar Ambulancia",
  });

  const [keywordData, setKeywordData] = useState([]);

  const fetchData = () => {
    fetch("https://operatorbackend.up.railway.app/relations")
      .then((response) => response.json())
      .then((data) => {
        console.log(data["words"]);
        setKeywordData(data["words"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const submitPair = () => {
    fetch("https://operatorbackend.up.railway.app/relations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setKeywordData([...keywordData, data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission actions here, e.g., data validation or sending data to a server
    console.log("Form data submitted:", formData);
  };

  const deletePair = (id) => {
    fetch(`https://operatorbackend.up.railway.app/relations/${id}/`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setKeywordData(keywordData.filter((item) => item.id !== id));
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <p>
      <Navbar />
      <Table>
        <Table.Head>
          <Table.HeadCell>Area / Nivel de Urgencia</Table.HeadCell>
          <Table.HeadCell>Palabra 1</Table.HeadCell>
          <Table.HeadCell>Palabra 2</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {keywordData.map((keyword) => {
            return (
              <Table.Row
                key={keyword.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {keyword.popup}
                </Table.Cell>
                <Table.Cell>{keyword.key1}</Table.Cell>
                <Table.Cell>{keyword.key2}</Table.Cell>
                <Table.Cell>
                  <button
                    onClick={() => deletePair(keyword.id)}
                    className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  >
                    Borrar
                  </button>
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <button
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-8 ml-8"
        type="button"
      >
        Crear Par
      </button>

      <div
        id="authentication-modal"
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative w-full max-w-lg max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="authentication-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Sign in to our platform
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                  <div className="col-span-5 w-full">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Palabra 1
                    </label>
                    <input
                      type="text"
                      name="key1"
                      id="key1"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Ingresa palabra"
                      required
                      value={formData.word1}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2 flex justify-center items-center">
                    <div>+</div>
                  </div>
                  <div className="col-span-5 w-full">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Palabra 2
                    </label>
                    <input
                      type="text"
                      name="key2"
                      id="key2"
                      placeholder="Ingresa palabra"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      value={formData.word2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Frase
                  </label>
                  <select
                    id="phrase"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                    onChange={handleInputChange}
                    value={formData.phrase}
                    name="popup"
                  >
                    <option value="Despachar Ambulancia">
                      Llamar Ambulancia
                    </option>
                    <option value="Despachar Policía">Despachar Policía</option>
                    <option value="Despachar Bomberos">
                      Despachar Bomberos
                    </option>
                    <option value="Despachar Protección Civil">
                      Despachar Protección Civil
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  onClick={submitPair}
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Crear Par
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </p>
  );
}
