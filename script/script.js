// Validation for Input
function validateForm() {
  // Get references to the form elements
  var idInput = document.getElementById("id");
  var nameInput = document.getElementById("name");
  var priceInput = document.getElementById("price");
  var image = document.getElementById("inputGroupFile01");
  // Get the values from the input fields
  var nameInput = nameInput.value.trim();
  var priceInput = priceInput.value.trim();
  var idInput = idInput.value.trim();

  if (idInput === "" || isNaN(idInput)) {
    alert("Please enter id");
    return false;
  }
  // Validate name input
  if (nameInput === "") {
    alert("Please enter your name");
    return false;
  }
  // Validate number input
  if (priceInput === "" || isNaN(priceInput)) {
    alert("Please enter appropriate price number");
    return false;
  }
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
  productList.forEach(function (element, index) {
    html += `<div class'card-body'>
     <div class='row gx-5'>
     <div class='col'>
     <div class='p-3'>
     <div class='card d-flex' style='width: 18rem;'>
     <div class='card-body'>
     <h5 class='card-title'>Id #${element.id} </h5>
     <img src="${element.image}" class='card-img-top' alt='Image'>
     </div>
     <ul class='list-group list-group-flush'>
     <li class='list-group-item'>Product :  ${element.name}  </li>
     <li class='list-group-item'>Price :  $${element.price}</li>
     </ul>
     <div class='card-body text-center'>
    
      <button onclick='editdata("${index}")' type='button' data-bs-toggle='modal' data-bs-target='#exampleModal-2' class='btn btn-outline-success'><i class='fa-solid fa-pen-to-square'></i> Edit</button>
    
      <button onclick='deletedata("${index}")' type='button' class='btn btn-outline-danger'><i class='fa-solid fa-trash'></i> Delete</button>
     </div>
     </div>
     </div>
     </div>
     </div>
     </div>`;
  });
  document.querySelector("#curd-table").innerHTML = html;
}
// Load all data when document or page load
document.onload = showData();
// Function to add Data
function AddData() {
  if (validateForm() == true) {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let image = document.getElementById("inputGroupFile01");
    const reader = new FileReader();

    let productList;
    if (localStorage.getItem("productList") == null) {
      productList = [];
    } else {
      productList = JSON.parse(localStorage.getItem("productList"));
    }
    reader.readAsDataURL(image.files[0]);
    reader.addEventListener("load", () => {
      productList.push({
        id: id,
        name: name,
        price: price,
        image: reader.result,
      });
      localStorage.setItem("productList", JSON.stringify(productList));
      showData();
    });

    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("inputGroupFile01").value = "";
    alert("Data Added Successfully");
  }
}
// Function to Delete Data
function deletedata(index) {
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
  }
}
// Function to update/Edit the data in local storage
function editdata(index) {
  var productList;
  if (localStorage.getItem("productList") == null) {
    productList = [];
  } else {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  document.getElementById("id-edit").value = productList[index].id;
  document.getElementById("name-edit").value = productList[index].name;
  document.getElementById("price-edit").value = productList[index].price;

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

    localStorage.setItem("productList", JSON.stringify(productList));

    showData();
    document.getElementById("id-edit").value = "";
    document.getElementById("name-edit").value = "";
    document.getElementById("price-edit").value = "";
    alert("Data Updated Successfully");
  };
}