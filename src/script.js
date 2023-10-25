//#region filtro
const search = document.querySelector(".input-group input"),
  table_rows = document.querySelectorAll("tbody tr"),
  table_headings = document.querySelectorAll("thead th");

search.addEventListener("input", searchTable);

function searchTable() {
  table_rows.forEach((row, i) => {
    let table_data = row.textContent.toLowerCase(),
      searc_data = search.value.toLowerCase();

    row.classList.toggle("hide", table_data.indexOf(searc_data) < 0);
    row.style.setProperty("--delay", i / 25 + "s");
  });

  document.querySelectorAll("tbody tr:not(.hide)").forEach((visible_row, i) => {
    visible_row.style.backgroundcolor =
      1 % 2 == 0 ? "transparent" : "#0000000b";
  });
}

// Sorting table
table_headings.forEach((head, i) => {
  let sort_asc = true;
  head.onclick = () => {
    table_headings.forEach((head) => head.classList.remove("active"));
    head.classList.add("active");

    document
      .querySelectorAll("td")
      .forEach((td) => td.classList.remove("active"));
    table_rows.forEach((row) => {
      row.querySelectorAll("td")[i].classList.add("active");
    });

    head.classList.toggle("asc", sort_asc);
    sort_asc = head.classList.contains("asc") ? false : true;

    sortTable(i, sort_asc);
  };
});

function sortTable(column, sort_asc) {
  [...table_rows]
    .sort((a, b) => {
      let first_row = a
          .querySelectorAll("td")
          [column].textContent.toLowerCase(),
        second_row = b.querySelectorAll("td")[column].textContent.toLowerCase();

      return sort_asc
        ? first_row < second_row
          ? 1
          : -1
        : first_row < second_row
        ? -1
        : 1;
    })
    .map((sorted_row) =>
      document.querySelector("tbody").appendChild(sorted_row)
    );
}
//#endregion

//#region fetchAPI
  const tablaDatosApi = document.getElementById("tablaDatosApi");
  const tbody = tablaDatosApi.querySelector("tbody");

  // Función para cargar datos desde la API
  function cargarDatos() {
    fetch(
      "https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks"
    )
      .then((response) => response.json())
      .then((data) => {
        // Limpiar el tbody
        tbody.innerHTML = "";

        // Recorrer los datos y agregar filas a la tabla
        data.forEach((tarea) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${tarea.title}</td>
            <td>${tarea.description}</td>
            <td>${tarea.completed}</td>
            <td>${tarea.priority}</td>
            <td>${tarea.tag}</td>
            <td>${tarea.dueDate}</td>
            <td>
              <button class="btn-edit">Editar</button>
              <button class="btn-delete">Eliminar</button>
            </td>
          `;
          tbody.appendChild(row);

          // Agregar eventos para la edición y eliminación de datos
          const btnEdit = row.querySelector(".btn-edit");
          btnEdit.addEventListener("click", () => editarTarea(tarea.id, row));
          const btnDelete = row.querySelector(".btn-delete");
          btnDelete.addEventListener("click", () =>
            eliminarTarea(tarea.id, row)
          );
        });
      })
      .catch((error) => console.error("Error al cargar datos:", error));
  }

  // Función para editar una tarea
  function editarTarea(id, row) {
    // Obtener los valores editados de la fila
    const updatedData = {
      title: row.cells[0].textContent,
      description: row.cells[1].textContent,
      completed: row.cells[2].textContent,
      priority: row.cells[3].textContent,
      tag: row.cells[4].textContent,
      dueDate: row.cells[5].textContent,
    };

    // Enviar una solicitud de actualización a la API
    fetch(
      `https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then(() => {
        console.log("Tarea actualizada con éxito");
      })
      .catch((error) => console.error("Error al actualizar tarea:", error));
  }

  // Función para eliminar una tarea
  function eliminarTarea(id, row) {
    const confirmarEliminicacion = window.confirm(
      "¿Estas seguro de eliminar la tarea?"
    );

    if (confirmarEliminicacion) {
      // Enviar una solicitud de eliminación a la API
      fetch(
        `https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks/${id}`,
        {
          method: "DELETE",
        }
      )
        .then(() => {
          // Eliminar la fila de la tabla
          tbody.removeChild(row);
          window.confirm("Tarea eliminada con éxito");
        })
        .catch((error) => console.error("Error al eliminar tarea:", error));
    }
  }

  // Cargar datos cuando se carga la página
  cargarDatos();


//#endregion

//#region modal agregar tarea
const modal = document.getElementById("modal");
const addTaskButton = document.getElementById("addHomework");
const closeModal = document.getElementById("closeModalBtn");

addTaskButton.addEventListener("click", () =>{
  modal.style.display = "block";
})

closeModal.addEventListener("click",() =>{
  modal.style.display = "none";
})

document.addEventListener("click", (event)=>{
  if(event.target === modal){
    modal.style.display = "none";
  }
});
//#endregion