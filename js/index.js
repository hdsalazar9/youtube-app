let apiKey = "AIzaSyCS6vqWC6Ia1dq9iGGtWWF8xw3Te5uIWwU";

function handleFetch(searchTerm, urlSearch, callback) {
  //The fetching code:
  $.ajax({
    url: urlSearch,
    method: "GET",
    data: {
      apiKey: apiKey,
      q: searchTerm,
    },
    dataType: "json",
    success: responseJson => callback(responseJson),
    error: err => console.log(err)
  });
}

function displayVideos(data) {
  let searchTerm = $('#searchBox').val();
  $('.results').html(''); //Empty the html of that section
  $('.previousVideos').attr("disabled", true);
  $('.nextVideos').attr("disabled", true); // Disable buttons of next pages
  $('.previousVideos').unbind('click');
  $('.nextVideos').unbind('click'); //Remove the previous onclick event

  for(var i=0; i<data.items.length; i++){
    let newVideoItem = `
      <div class="videoItem">
        <a href ="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target = "_blank">
          <div class="videoImg">
            <img src="${data.items[i].snippet.thumbnails.default.url}" alt="Video thumbnail" />
          </div>
          <span class="videoTitle lato">
            ${data.items[i].snippet.title}
          </span>
        </a>
      </div>
    `;
    $('.results').append(newVideoItem);
  }

  if(data.nextPageToken){
    $('.nextVideos').attr("disabled", false);
    $('.nextVideos').on("click", function(event){
      if(searchTerm != "")
      {
        let urlSearch = `https://www.googleapis.com/youtube/v3/search?pageToken=${data.nextPageToken}&part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}&type=video`;
        handleFetch(searchTerm, urlSearch, displayVideos);
      }
    });
  }
  if(data.prevPageToken){
    $('.previousVideos').attr("disabled", false);
    $('.previousVideos').on("click", function(event){
      if(searchTerm != "")
      {
        let urlSearch = `https://www.googleapis.com/youtube/v3/search?pageToken=${data.prevPageToken}&part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}&type=video`;
        handleFetch(searchTerm, urlSearch, displayVideos);
      }
    });
  }

}

function watchForm() {
  $('.searchForm').on('submit', (event) => {
    event.preventDefault();

    let searchTerm = $('#searchBox').val();
    let urlSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchTerm}&key=${apiKey}&type=video`;

    if (searchTerm != "")
      handleFetch(searchTerm, urlSearch, displayVideos);
  });
}

$(watchForm);
