
const toggleBtn =document.querySelector('.sidebar-toggle');
const closeBtn =document.querySelector('.close-btn');
const sidebar =document.querySelector('.sidebar');
toggleBtn.addEventListener('click', function(){
  //using toggle
  toggleBtn.style.display = "none";
  sidebar.classList.toggle('show-sidebar');
});
closeBtn.addEventListener('click', function(){
  sidebar.classList.remove('show-sidebar');
    toggleBtn.style.display = "block";
});

const imageUrl = "../tmp/test.jpg";
async function getImage(imageUrl, imgID){
  const response = await fetch(imageUrl)
  const imageBlob = await response.blob()
  const url = URL.createObjectURL(imageBlob)
  const image = new Image()
  image.src = url
  image.style = "width:50%;height:50%;margin-top:0;margin-right:0;margin-left:21.5%;"
  document.body.appendChild(image)
  document.getElementById(imgID).appendChild(image);
}
getImage("../tmp/18LSNx6BRBcyolvbs35_fyyYBHmb3g8fS.jpg", "image");
getImage("../tmp/18JGYg6Op6YjPVIKcqUAfRuCt3fCJw85H.jpg", "image1");
getImage("../tmp/1pq5JFMCdHah-l8eMd0xtwxjF2NAZJ0jA.jpg", "image2");
