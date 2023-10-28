import { Table } from "flowbite-react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Database() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("http://127.0.0.1:5000/overview")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <Table>
        <Table.Head>
          <Table.HeadCell>ID de Transcripcion</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>

          <Table.HeadCell>Texto</Table.HeadCell>

          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((item) => {
            return (
              <Table.Row
                key={item.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.id}
                </Table.Cell>
                <Table.Cell>{item.fecha}</Table.Cell>

                <Table.Cell>{item.transcript}</Table.Cell>

                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
