CKEDITOR.plugins.add('pwlink', {

	init: function(editor) {
		editor.addCommand('insertPwlink', {

			exec: function(editor) {

				var href = '';
				var target = '';
				var innerHTML = '';
				var pageID = $("#Inputfield_id").val();
				var modalUrl = config.urls.admin + 'page/link/?id=' + pageID + '&modal=1';
				var $iframe = $('<iframe id="pwlink_iframe" frameborder="0" src="' + modalUrl + '"></iframe>');
				var selection = editor.getSelection();
				var selectionElement = selection.getSelectedElement();
				var node = selection.getStartElement();
				var selectionText = selection.getSelectedText();

				if(node.getName() == 'a') {
					href = node.getAttribute('href'); 
					target = node.getAttribute('target'); 
					selection.selectElement(node); 
					selectionText = node.getHtml();
				}

				$iframe.load(function() {
					var $i = $iframe.contents();
					$i.find("#link_page_url").val(href);
					$i.find("#ProcessPageEditLinkForm").data('iframe', $iframe);
					if(target && target.length) $i.find("#link_target").attr('checked', 'checked');
                                });

				var windowWidth = $(window).width()-300;
				var windowHeight = $(window).height()-300;
				if(windowHeight > 800) windowHeight = 800;

				var insertLinkLabel = 'Insert Link'; // config.InputfieldTinyMCE.pwlink.label;
				var cancelLabel = 'Cancel'; // config.InputfieldTinyMCE.pwlink.cancel;

                                $iframe.dialog({
                                        title: insertLinkLabel,
                                        height: windowHeight,
                                        width: windowWidth,
                                        position: [150,80],
                                        modal: true,
                                        overlay: {
                                                opacity: 0.7,
                                                background: "black"
                                        },
                                        buttons: [
                                                {
                                                        text: insertLinkLabel,
                                                        click: function() {

                                                                var $i = $iframe.contents();
                                                                var url = $("#link_page_url", $i).val();
                                                                var target = $("#link_target", $i).is(":checked") ? "_blank" : '';

                                                                if(target && target.length > 0) target = ' target="' + target + '"';
                                                                if(url.length) {
                                                                        var html = '<a href="' + url + '"' + target + '>' + selectionText + '</a>';
									editor.insertHtml(html); 
                                                                }
                                                                $iframe.dialog("close");

                                                        }
                                                }, {
                                                        text: cancelLabel,
                                                        click: function() { $iframe.dialog("close"); }
                                                }
                                        ]
                                }).width(windowWidth).height(windowHeight);
			}
		}); 

		editor.ui.addButton('PWLink', {
			label: 'ProcessWire Link', 
			command: 'insertPwlink', 
			icon: this.path + 'images/pwlink.png'
				
		}); 
	}
}); 
