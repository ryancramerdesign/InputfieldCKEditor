CKEDITOR.plugins.add('pwimage', {

	init: function(editor) {
		editor.addCommand('insertPwimage', {

			exec: function(editor) {

				var page_id = $("#Inputfield_id").val(); 
				var file = '';
				var imgClass = '';
				var imgWidth = 0;
				var imgHeight = 0;
				var imgDescription = '';
				var imgLink = '';
				var selection = editor.getSelection();
				var se = selection.getSelectedElement();
				var node = selection.getStartElement();
				var $node = $(node);
				var nodeParent = node.getParent();
				var $nodeParent = $(nodeParent);
				var src = $node.attr('src'); 

				if(src) { 
					var parts = src.split('/'); 
					file = parts.pop();
					imgClass = $node.attr('class'); 
					imgWidth = $node.attr('width');
					imgHeight = $node.attr('height'); 
					imgDescription = $node.attr('alt'); 
					imgLink = $nodeParent.is("a") ? $nodeParent.attr('href') : '';

					parts = parts.reverse();
					page_id = 0; 

					// pull page_id out of img[src]
					for(n = 0; n < parts.length; n++) {
						page_id = parseInt(parts[n]); 
						if(page_id > 0) break;
					}
				}
				

				var modalUri = config.urls.admin + 'page/image/';
				var queryString = '?id=' + page_id + '&modal=1';

				var windowHeight = $(window).height() - 250; 
				var windowWidth = $(window).width() - 200; 

				if(file.length) queryString += "&file=" + file; 
				if(imgWidth) queryString += "&width=" + imgWidth; 
				if(imgHeight) queryString += "&height=" + imgHeight; 
				if(imgClass && imgClass.length) queryString += "&class=" + imgClass; 
				if(imgDescription && imgDescription.length) queryString += "&description=" + escape(imgDescription);
				if(imgLink && imgLink.length) queryString += "&link=" + escape(imgLink);
				queryString += "&winwidth=" + windowWidth; 

				// create iframe dialog box
				$iframe = $('<iframe id="pwimage_iframe" width="100%" frameborder="0" src="' + modalUri + queryString + '"></iframe>'); 
				$iframe.dialog({
					title: config.InputfieldCKEditor.pwimage.selectLabel, // "Select Image", 
					height: windowHeight,
					width: windowWidth,
					position: [100, 80], 
					modal: true,
					overlay: {
						opacity: 0.7,
						background: "black"
					}
				}).width(windowWidth).height(windowHeight);

				$iframe.load(function() {

					// when iframe loads, pull the contents into $i 
					var $i = $iframe.contents();

					if($i.find("#selected_image").size() > 0) {
						// if there is a #selected_image element on the page...

						$iframe.dialog("option", "buttons", [
							{ 
								text: config.InputfieldCKEditor.pwimage.insertBtn, // "Insert This Image",
								click:  function() {

									function insertImage(src) {

										var $i = $iframe.contents();
										var $img = $("#selected_image", $i); 
										//var src = $img.attr('src'); 
										var width = $img.attr('width');
										var height = $img.attr('height'); 
										var alt = $("#selected_image_description", $i).val();
										var cls = $img.removeClass('ui-resizable').attr('class'); 
										var link = $("#selected_image_link:checked", $i).val();
										var html = '<img class="' + cls + '" src="' + src + '" '; 

										if(alt && alt.length > 0) alt = $("<div />").text(alt).html().replace(/"/g, '&quot;'); 

										if(width > 0) html += 'width="' + width + '" '; 
										if(height > 0) html += 'height="' + height + '" '; 
										html += 'alt="' + alt + '" />';
										if(link && link.length > 0) html = "<a href='" + link + "'>" + html + "</a>";
										if(nodeParent && $nodeParent.is("a")) se.select(nodeParent); // add it to the selection 
										editor.insertHtml(html); 
										$iframe.dialog("close"); 
									}

									var $i = $iframe.contents();
									var $img = $("#selected_image", $i); 

									$iframe.dialog("disable").dialog("option", "title", config.InputfieldCKEditor.pwimage.savingNote); // Saving Image
									$img.removeClass("resized"); 

									var cls = $img.attr('class'); 
									var width = $img.attr('width');
									if(!width) width = $img.width();
									var height = $img.attr('height'); 
									if(!height) height = $img.height();
									var file = $img.attr('src'); 
									var page_id = $("#page_id", $i).val();
									file = file.substring(file.lastIndexOf('/')+1); 

									$.get(modalUri + 'resize?id=' + page_id + '&file=' + file + '&width=' + width + '&height=' + height, function(data) {
										var $div = $("<div></div>").html(data); 
										var src = $div.find('#selected_image').attr('src');
										insertImage(src); 
									}); 

								}
							}, {

								text: config.InputfieldCKEditor.pwimage.selectBtn, // "Select Another Image", 
								click: function() {
									var $i = $iframe.contents();
									var page_id = $("#page_id", $i).val();
									$iframe.attr('src', modalUri + '?id=' + page_id + '&modal=1'); 
									$iframe.dialog("option", "buttons", {}); 
								}
							}, {
								text: config.InputfieldCKEditor.pwimage.cancelBtn, // "Cancel",
								click: function() { $iframe.dialog("close"); }
							}
						]).dialog("option", "title", config.InputfieldCKEditor.pwimage.editLabel).width(windowWidth).height(windowHeight); // "Edit Image"


					} else {
						$iframe.dialog("option", "buttons", [
							{
								text: config.InputfieldCKEditor.pwimage.cancelBtn, // "Cancel", 
								click: function() { $iframe.dialog("close"); }
							}
						]).width(windowWidth).height(windowHeight);
					}
				});
			}
		}); 

		editor.ui.addButton('PWImage', {
			label: 'ProcessWire Image', 
			command: 'insertPwimage', 
			icon: this.path + 'images/pwimage.png'
				
		}); 
	}
}); 
