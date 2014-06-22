(function() {
	
	CKEDITOR.plugins.add('pwimage', {
		
		requires: 'dialog',
		
		init: function(editor) {
			
			var pluginName = 'pwimage';
			
			// These are the allowed and required elements & attributes for images. It should clean all other classes but three align classes that are generated by ProcessWire
			var allowed = 'img[alt,id,!src,title]{class}(align_left,align_center,align_right);a[!href]';
			var required = 'img[alt,src]';
			
			// add pwimage command (opens the ProcessWire image selection iFrame)
			editor.addCommand(pluginName, {
				allowedContent: allowed,
				requiredContent: required,
				exec: loadIframeImagePicker
			}); 

			//* retina icon support *
			var icon = this.path + 'images/pwimage.png',
				iconOffset;
			if ( CKEDITOR.env.hidpi ) {
				icon = this.path + '../icons_hidpi.png';
				iconOffset = -936;
			}

			editor.ui.addButton('PWImage', {
				label: editor.lang.common.image,
				command: pluginName, 
				icon: this.path + 'images/pwimage.png'
			}); 
	
			// On double click we execute the command (= we open the pw image selection iFrame defined above)
			editor.on( 'doubleclick', function( evt ) {
				var element = evt.data.element;
				if ( element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() ) {
					editor.commands.pwimage.exec();
				}
					
			});
		
			// If the "menu" plugin is loaded, register the menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems({
					image: {
						label: editor.lang.image.menu,
						command: 'pwimage',
						group: 'image'
					}
				});
			}
		
			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					if ( getSelectedImage( editor, element ) )
						return { image: CKEDITOR.TRISTATE_OFF };
				});
			}
		
		}
	}); 

	function getSelectedImage( editor, element ) {
		if ( !element ) {
			var sel = editor.getSelection();
			element = sel.getSelectedElement();
		}

		if ( element && element.is( 'img' ) && !element.data( 'cke-realelement' ) && !element.isReadOnly() )
			return element;
	}

	function loadIframeImagePicker(editor) {

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
			imgLink = (nodeParent.$.nodeName === "A") ? nodeParent.$.href : '';

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

		var windowHeight = $(window).height() - 350; 
		var windowWidth = $(window).width() - 200; 

		if(file.length) queryString += "&file=" + file; 
		if(imgWidth) queryString += "&width=" + imgWidth; 
		if(imgHeight) queryString += "&height=" + imgHeight; 
		if(imgClass && imgClass.length) queryString += "&class=" + imgClass; 
		if(imgDescription && imgDescription.length) queryString += "&description=" + encodeURIComponent(imgDescription);
		if(imgLink && imgLink.length) queryString += "&link=" + encodeURIComponent(imgLink);
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
								if(nodeParent && nodeParent.$.nodeName === "A") selection.selectElement(nodeParent); // add it to the selection 
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
	
})();
