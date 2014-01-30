
	var App = {};
	var Instagram = {};

	// credenciais do instagram
	Instagram.Config = {
	  clientID: '43aaf89a6ffb4bc9bbf671bdb2264945',
	  apiHost: 'https://api.instagram.com'
	};


(function(){
	var photoTemplate, resourceInstagram;
	var photos_html = '';

	function init(){
		bindEventHandlers();
	    photoTemplate = _.template($('#photo-template').html());
	}


	function toTemplateInstagram(photo){
	    photo = {
	      count: photo.likes.count,
	      avatar: photo.user.profile_picture,
	      photo: photo.images.standard_resolution.url,
	      url: photo.link
	    };

	    return photoTemplate(photo);
	}


	function toScreenPhotos(photos){
	    $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                    .fadeIn();

	    $.each(photos.data, function(index, photo){
	      photos_html += toTemplateInstagram(photo);
	      $('div#photos-wrap').append(toTemplateInstagram(photo));
	    });
	}


	function generateResourceInstagram(tag){
	    var config = Instagram.Config, url;

	    if(typeof tag === 'undefined'){
	      throw new Error("Coloque uma Tag, exemplo Brasil");
	    } else {
	      tag = String(tag).trim().split(" ")[0];
	    }

	    url = config.apiHost + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;
	    
	    return function(max_id){
	      var next_page;
	      if(typeof max_id === 'string' && max_id.trim() !== '') {
	        next_page = url + "&max_id=" + max_id;
	      }
	      return next_page || url;
	    };

	}

	function fetchPhotos(max_id){
	    $.getJSON(resourceInstagram(max_id), toScreenPhotos);
	}

	function search(tag){
	    resourceInstagram = generateResourceInstagram(tag);

	    //console.log(resourceInstagram());

	    $('.paginate a').hide();
	    $('#photos-wrap > *').remove();

	    fetchPhotos();
	   
	    $('#photos-wrap').html(photos_html);
	}

	function bindEventHandlers(){

		$('body').on('click', '.paginate a.btn', function(){
		
			var tagID = $(this).attr('data-max-tag-id');
			fetchPhotos(tagID);

			return false;
		});

		$('form').on('submit', function(e){
			e.preventDefault();
			var tag = $('input.search-tag').val().trim();
			if(tag) {
				search(tag);
			};

		});

	}

	function showPhoto(p){
	    $(p).fadeIn();
	}

	
  App = {
    search: search,
    showPhoto: showPhoto,
    init: init
  };


}());


function getUrl(p, href) {
    var parName = p.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var rx = new RegExp("[\\?&#]" + parName + "=([^&#]*)");
    var valor = rx.exec(href);
    if (valor == null) {
        return 1;
    } else {
        return valor[1];
    }
}