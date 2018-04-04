$(document).ready(function() {
	
	var articleCount
	var newArticles = 0;



	//Upon clicking the SCRAPE NEW ARTICLES button, another scrape will be performed a modal will inform the user how many
	//new articles, if any, were added.
	$(document).on("click", ".scrape-new", function() {
		$.get("/scrape").then(function() {

			$.get("/articles/saved=false", function(data){

				newArticles = (data.length-articleCount);
				
				if (newArticles > 0){
				$("#scrapeResult").text(newArticles+" new articles have been added!");
				$("#scrapeModal").modal("toggle");
				newArticles = 0;
				} 

				else {
				$("#scrapeResult").text("No new articles have been added.");
				$("#scrapeModal").modal("toggle");
		    }

	    });
	  });
	});

  //Once the modal is closed, the page will refresh; revealing any new articles if they were added to the database.
  $('#scrapeModal').on('hidden.bs.modal', function () {
  location.reload();
  });

	$(document).on("click", ".save", function() {
		var thisId = this.dataset.id;
		$.ajax({
	    method: "POST",
	    url: "/articles/saved/" + thisId,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {
	  	console.log(data);
	    location.reload();
	   });
	});
});