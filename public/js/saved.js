$(document).ready(function() {  

  var thisID


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

//Should a user delete an article from the saved articles page, it will switch the boolean value and remove all associated
//notes from the article. It will likely be pulled again on the next scrape on the main page however.
  $(document).on("click", ".delete", function() {
    var thisId = this.dataset.id;
      $.ajax({
      method: "POST",
      url: "/articles/deleted/" + thisId,
      data: {
        saved: false
      }
    }).done(function(data) {
       location.reload();
     });
  });

//Should a user click the Article Notes button, a modal will be toggled displaying any notes, if there any have been saved
//by any user, and a text area to allow the user to save their own notes. If no notes have been posted, a message
//informing the user of that will be displayed instead.
  $(document).on("click", ".notes", function() {
    thisId = this.dataset.id
    $("#notesHeading").text("Notes for Article: "+thisId)
    $.getJSON("/articles/notes/"+thisId, function(data) {
      if (data.note[0] !== undefined){
        for (i=0;i<data.note.length;i++){
        $.getJSON("/notes/saved/"+data.note[i], function(data){
          if (data[0] !== undefined){
            $("#notesResult").append("<li class='list-group-item note'>"
          +data[0].body+"<button class='btn btn-danger note-delete' data-id='"+data[0]._id+"'>x</button></li>")
            }
          })
        };
      } else {
      $("#notesResult").append("<li class='list-group-item note'>No notes have been posted to this article.</li>")
      }
    });
    $("#notesModal").modal("toggle");
  });

  // When the Save button is clicked, the value in the text area will be used to save a note and associate it with the
  // article whose modal is active.
  $(document).on("click", ".save", function() {
    
    if ($("#bodyinput").val() !== ""){
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    }) 
      .done(function(data) {  
        console.log(data);
        $("#notesModal").modal("toggle");
      });
    } else {
      return false;
    }
  });

  // If a user clicks to delete a note, the note is deleted from the database.
    $(document).on("click", ".note-delete", function() {
    var thisNoteId = this.dataset.id;
      $.ajax({
      method: "POST",
      url: "/notes/delete/" + thisNoteId
    }).done(function(data) {
       $("#notesModal").modal("toggle");
     });
  });

  // Upon the modal toggling off/away, the textarea and notes fields are emptied to prevent unintended stacking/overlap 
  // of old notes.
  $('#notesModal').on('hidden.bs.modal', function () {
  $("#bodyinput").val("");
  $("#notesResult").empty();
  });

});