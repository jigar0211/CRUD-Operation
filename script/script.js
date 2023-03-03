// Validation for Input
function validateForm() {
  // Get references to the form elements
  var nameInput = document.getElementById("name");
  var priceInput = document.getElementById("price");
  var descriptionInput = document.getElementById("description");
  var image = document.getElementById("inputGroupFile01");

  // Get the values from the input fields
  var name = nameInput.value.trim();
  var price = priceInput.value.trim();

  // Validate name input
  if (name === "") {
    alert("Please enter your name");
    return false;
  }

  // Validate price input
  if (price === "") {
    alert("Please enter the price");
    return false;
  }

  if (isNaN(price) || price.startsWith("0")) {
    alert("Please enter a valid price number that does not start with zero");
    return false;
  }

  // Validate description input
  if (descriptionInput.value.length > 50) {
    alert("Description can be maximum 50 characters");
    return false;
  }

  // Validate image input
  if (image.files.length === 0) {
    alert("Please attach an image");
    return false;
  }

  var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(image.files[0].name)) {
    alert("Please attach a valid image file (jpg, jpeg, png, or gif)");
    image.value = "";
    return false;
  }

  // Check the file size of the uploaded image
  var fileSize = image.files[0].size / 1024; // in KB
  if (fileSize > 750) {
    alert("Please attach an image that is smaller than 750KB");
    image.value = "";
    return false;
  }

  return true;
}

function showData() {
  let productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }
  let html = "";
  if (productList.length === 0) {
    // Display an image if the productList array is empty
    html += `<div class="card-body">
      <div class="row gx-2">
        <div class="col">
          <div class="p-3">
            <img src="img/7117865_3371471.jpg" class="img-fluid rounded mx-auto d-block" alt="No Products">
            <p class="text-center">No products to display</p>
          </div>
        </div>
      </div>
    </div>`;
  } else {
    productList.forEach(function (element, index) {
      // Generate HTML for each product card
      html += `<div class'card-body'>
      <div class='row gx-2'>
      <div class='col'>
      <div class='p-3'>
      <div class='card d-flex card-all'>
      <div class='card-body'>
      <h5 class='card-title'>Id #${element.id} </h5>
      <img src="${element.image}" class='card-img-top' alt='Image' height="240px" width="360px">
      </div>
      <ul class='list-group list-group-flush'>
      <li class='list-group-item'>Product :  ${element.name}  </li>
      <li class='list-group-item h-25'>Description :  ${element.description}  </li>
      <li class='list-group-item'>Price :  $${element.price}</li>
      </ul>
      <div class='card-body text-center'>
     
       <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-outline-success'><i class='fa-solid fa-pen-to-square'></i> Edit</button>
     
       <button onclick='deleteData("${index}")' type='button' class='btn btn-outline-danger'><i class='fa-solid fa-trash'></i> Delete</button>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>`;
    });
  }
  document.querySelector("#curd-table").innerHTML = html;
}

// Load all data when document or page load
showData();
// Function to add Data
function AddData() {
  if (validateForm() == true) {
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let description = document.getElementById("description").value;
    let image = document.getElementById("inputGroupFile01");
    const reader = new FileReader();

    let productList;
    if (localStorage.getItem("productList") == null) {
      productList = [];
    } else {
      productList = JSON.parse(localStorage.getItem("productList"));
    }
    
    // generate new ID by incrementing the highest existing ID
    let id = 1;
    if (productList.length > 0) {
      let ids = productList.map(product => product.id);
      id = Math.max(...ids) + 1;
    }

    reader.readAsDataURL(image.files[0]);
    reader.addEventListener("load", () => {
      productList.push({
        id: id,
        name: name,
        description: description,
        price: price,
        image: reader.result,
      });
      localStorage.setItem("productList", JSON.stringify(productList));
      location.reload();
      showData();
    });

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.getElementById("inputGroupFile01").value = "";
    document.getElementById("close-btn").click();
    alert("Data Added Successfully");
  }
}
// Function to Delete Data
function deleteData(index) {
  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  // Display a confirmation message to the user
  if (confirm("Are you sure you want to delete this item?")) {
    productList.splice(index, 1);
    localStorage.setItem("productList", JSON.stringify(productList));
    showData();
    location.reload(); // Reload the current page
  }
}
// Function to update/Edit the data in local storage
function editData(index) {
  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  document.getElementById("id-edit").value = productList[index].id;
  document.getElementById("name-edit").value = productList[index].name;
  document.getElementById("price-edit").value = productList[index].price;
  document.getElementById("description-edit").value =
    productList[index].description;

  var imagePreview = document.getElementById("image-div");
  imagePreview.src = productList[index].image;
  document.getElementById("image-div").innerHTML =
    "<img src=" + productList[index].image + " width='100%' height='100%'>";

  var imageEdit = document.getElementById("image-edit");
  imageEdit.onchange = function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      productList[index].image = reader.result;
      imagePreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  document.querySelector("#update").onclick = function () {
    productList[index].id = document.getElementById("id-edit").value;
    productList[index].name = document.getElementById("name-edit").value;
    productList[index].price = document.getElementById("price-edit").value;
    productList[index].description = document.getElementById("description-edit").value;

    localStorage.setItem("productList", JSON.stringify(productList));
    location.reload();
    showData();
    document.getElementById("id-edit").value = "";
    document.getElementById("name-edit").value = "";
    document.getElementById("price-edit").value = "";
    document.getElementById("description-edit").value = "";
    document.getElementById("close-btn").click();
    alert("Data Updated Successfully");
  };
}
// Filter Functions
const selectElem = document.querySelector("#sort-select");
selectElem.addEventListener("change", (event) => {
  const sortBy = event.target.value;
  filterProduct(sortBy); // perform the sorting action based on the selected value
  if (sortBy == "refresh-btn") {
    location.reload(); // refresh the page
  }
  console.log(sortBy);
});
// For filter the data
function filterProduct(sortvalue) {
  let sortedProduct = JSON.parse(localStorage.getItem("sortedProduct")) ?? [];
  let productList = JSON.parse(localStorage.getItem("productList")) ?? [];
  sortedProduct = productList;
  localStorage.setItem("sortedProduct", JSON.stringify(sortedProduct));
  // console.log('if',sortedProduct)
  if (sortvalue == "desc") {
    let desc = true;
    sortedProduct = sortedProduct.sort((a, b) =>
      desc ? b.id - a.id : a.id - b.id
    );
    desc = !desc;
    console.log("descending", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "asc") {
    let desc = false;
    sortedProduct = sortedProduct.sort((a, b) =>
      desc ? b.id - a.id : a.id - b.id
    );
    console.log("Asc", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "name") {
    sortedProduct = sortedProduct = sortedProduct.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    console.log("name", sortedProduct);
    return filteredData(sortedProduct);
  } else if (sortvalue == "price") {
    sortedProduct = sortedProduct.sort((a, b) => b.price - a.price);
    console.log("Price", sortedProduct);
    return filteredData(sortedProduct);
  } else {
    return false;
  }
}
function filteredData(sortedProduct) {
  let html = "";
  console.log("filterData", sortedProduct);
  if (sortedProduct.length === 0) {
    // Display an image if the productList array is empty
    html += `<div class="card-body">
      <div class="row gx-2">
        <div class="col">
          <div class="p-3">
            <img src="img/7117865_3371471.jpg" class="img-fluid rounded mx-auto d-block" alt="No Products">
            <p class="text-center">No products to display</p>
          </div>
        </div>
      </div>
    </div>`;
  } else { sortedProduct.forEach(function (element, index) {
      html += `<div class'card-body'>
       <div class='row gx-2'>
       <div class='col'>
       <div class='p-3'>
       <div class='card d-flex card-all'>
       <div class='card-body'>
       <h5 class='card-title'>Id #${element.id} </h5>
       <img src="${element.image}" class='card-img-top' alt='Image' height="240px" width="360px">
       </div>
       <ul class='list-group list-group-flush'>
       <li class='list-group-item'>Product :  ${element.name}  </li>
       <li class='list-group-item'>Description :  ${element.description}  </li>
       <li class='list-group-item'>Price :  $${element.price}</li>
       </ul>
       <div class='card-body text-center'>
      
        <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-outline-success'><i class='fa-solid fa-pen-to-square'></i> Edit</button>
      
        <button onclick='deleteData("${index}")' type='button' class='btn btn-outline-danger'><i class='fa-solid fa-trash'></i> Delete</button>
       </div>
       </div>
       </div>
       </div>
       </div>
       </div>`;
    });
  }
  document.querySelector("#curd-table").classList.add("d-none");
  document.querySelector("#sort-table").innerHTML = html;
}
//for Search the data
function searchBar() {
  const searchvalue = document.querySelector("#serachProductText").value;
  console.log(searchvalue);
  let sortedItem = [];
  let sortedProduct = JSON.parse(localStorage.getItem("productList")) ?? [];
  let regex = new RegExp(searchvalue, "i");
  for (let element of sortedProduct) {
    const item = element;
    if (regex.test(item.name)) {
      sortedItem.push(element);
    }
  }
  console.log(sortedItem);
  searchProduct(sortedItem);
}
function searchProduct(sortedItem) {
  let html = "";
  console.log("searchProduct", sortedItem);
  if (sortedItem.length === 0) {
    // Display an image if the productList array is empty
    html += `<div class="card-body">
      <div class="row gx-2">
        <div class="col">
          <div class="p-3">
            <img src="img/20943829.jpg" class="img-fluid rounded mx-auto d-block" alt="No Products">
            <p class="text-center">No products Found</p>
          </div>
        </div>
      </div>
    </div>`;
  } else {
  sortedItem.forEach(function (element, index) {
    html += `<div class'card-body'>
       <div class='row gx-2'>
       <div class='col'>
       <div class='p-3'>
       <div class='card d-flex card-all' >
       <div class='card-body'>
       <h5 class='card-title'>Id #${element.id} </h5>
       <img src="${element.image}" class='card-img-top' alt='Image' height="240px" width="360px">
       </div>
       <ul class='list-group list-group-flush'>
       <li class='list-group-item'>Product :  ${element.name}  </li>
       <li class='list-group-item'>Description :  ${element.description}  </li>
       <li class='list-group-item'>Price :  $${element.price}</li>
       </ul>
       <div class='card-body text-center'>
      
        <button onclick='editData("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-outline-success'><i class='fa-solid fa-pen-to-square'></i> Edit</button>
      
        <button onclick='deleteData("${index}")' type='button' class='btn btn-outline-danger'><i class='fa-solid fa-trash'></i> Delete</button>
       </div>
       </div>
       </div>
       </div>
       </div>
       </div>`;
  });
}
  document.querySelector("#curd-table").classList.add("d-none");
  document.querySelector("#sort-table").innerHTML = html;
}