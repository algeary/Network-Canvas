/* global $, window, Odometer, document, note  */
/* exported VenueGenerator */
module.exports = function VenueGenerator() {
    'use strict';
    //global vars
    var venueGenerator = {};
    venueGenerator.options = {
        nodeType:'Venue',
        edgeType:'Venue',
        targetEl: $('.container'),
        variables: [],
        heading: 'This is a default heading',
        subheading: 'And this is a default subheading',
        panels: [],
    };

    var nodeBoxOpen = false;
    var editing = false;
    var newNodePanel;
    var venueCounter;

    var venueCount = window.network.getNodes({type_t0: 'Venue'}).length;

    var keyPressHandler = function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (nodeBoxOpen === false) {
                venueGenerator.openNodeBox();
            } else if (nodeBoxOpen === true) {
                $('.submit-1').click();
            }
        }

        if (e.keyCode === 27) {
            venueGenerator.closeNodeBox();
        }

        // Prevent accidental backspace navigation
        if (e.keyCode === 8 && !$(e.target).is('input, textarea')) {
            e.preventDefault();
        }

    };

    var stageChangeHandler = function() {
        venueGenerator.destroy();
    };

    var cardClickHandler = function() {
        // Handles what happens when a card is clicked

        // Get the ID of the node corresponding to this card, stored in the data-index property.
        var index = $(this).data('index');

        // Get the dyad edge for this node
        var edge = window.network.getEdges({from:window.network.getEgo().id, to: index, type:'Venue'})[0];

        // Set the value of editing to the node id of the current person
        editing = index;

        // Populate the form with this nodes data.
        $.each(venueGenerator.options.variables, function(index, value) {
            if(value.private === false) {
                if (value.type === 'dropdown') {
                    $('.selectpicker').selectpicker('val', edge[value.variable]);
                } else if (value.type === 'scale') {
                    $('input:radio[name="'+value.variable+'"][value="'+edge[value.variable]+'"]').prop('checked', true).trigger('change');
                } else {
                    $('#'+value.variable).val(edge[value.variable]);
                }

                $('.delete-button').show();

                if (edge.elicited_previously === true) {
                    $('input#age_p_t0').prop( 'disabled', true);
                } else {
                    $('input#age_p_t0').prop( 'disabled', false);
                }
                venueGenerator.openNodeBox();
            }

        });

    };

    var cancelBtnHandler = function() {
        $('.delete-button').hide();
        venueGenerator.closeNodeBox();
    };

    var submitFormHandler = function(e) {
        note.info('submitFormHandler()');

        e.preventDefault();

        var data = $(this).serializeArray();
          var cleanData = {};
          for (var i = 0; i < data.length; i++) {

            // To handle checkboxes, we check if the key already exists first. If it
            // does, we append new values to an array. This keeps compatibility with
            // single form fields, but might need revising.

            // Handle checkbox values
            if (data[i].value === 'on') { data[i].value = 1; }

            // This code takes the serialised output and puts it in the structured required to store within noded/edges.
            if (typeof cleanData[data[i].name] !== 'undefined' && typeof cleanData[data[i].name] !== 'object') {
              // if it isn't an object, its a string. Create an empty array and store by itself.
              cleanData[data[i].name] = [cleanData[data[i].name]];
              cleanData[data[i].name].push(data[i].value);
            } else if (typeof cleanData[data[i].name] !== 'undefined' && typeof cleanData[data[i].name] === 'object'){
              // Its already an object, so append our new item
              cleanData[data[i].name].push(data[i].value);
            } else {
              // This is for regular text fields. Simple store the key value pair.
              cleanData[data[i].name] = data[i].value;
            }

          }


        var newEdgeProperties = {};
        var newNodeProperties = {};
        $('.delete-button').hide();
        $.each(venueGenerator.options.variables, function(index,value) {

            if(value.target === 'edge') {
                if (value.private === true) {
                    newEdgeProperties[value.variable] = value.value;
                } else {
                    newEdgeProperties[value.variable] = cleanData[value.variable];
                }

            } else if (value.target === 'node') {
                if (value.private === true) {
                    newNodeProperties[value.variable] = value.value;
                } else {
                    newNodeProperties[value.variable] = cleanData[value.variable];
                }
            }
        });

        if (editing === false) {
            note.info('// We are submitting a new node');
            var newNode = window.network.addNode(newNodeProperties);

            var edgeProperties = {
                from: window.network.getEgo().id,
                to: newNode,
                type:venueGenerator.options.edgeTypes[0]
            };

            window.tools.extend(edgeProperties,newEdgeProperties);
            window.network.addEdge(edgeProperties);
            venueGenerator.addToList(edgeProperties);
            venueCount++;
            venueCounter.update(venueCount);

        } else {
            note.info('// We are updating a node');

            var color = function() {
                var el = $('div[data-index='+editing+']');
                var current = el.css('background-color');
                el.stop().transition({background:'#1ECD97'}, 400, 'ease');
                setTimeout(function(){
                    el.stop().transition({ background: current}, 800, 'ease');
                }, 700);
            };

            var nodeID = editing;

            var edges = window.network.getEdges({from:window.network.getEgo().id,to:nodeID,type:venueGenerator.options.edgeTypes[0]});
            $.each(edges, function(index,value) {
                window.network.updateEdge(value.id,newEdgeProperties, color);
            });

            window.network.updateNode(nodeID, newNodeProperties);

            // update relationship roles

            $('div[data-index='+editing+']').html('');
            $('div[data-index='+editing+']').append('<h4>'+newEdgeProperties.venue_name_t0+'</h4>');

            venueCount = window.network.getNodes({type_t0: 'Venue'}).length;
            venueCounter.update(venueCount);
            editing = false;

        }

        venueGenerator.closeNodeBox();

    };

    venueGenerator.openNodeBox = function() {
        $('.newVenueBox').height($('.newVenueBox').height());
        $('.newVenueBox').addClass('open');
        $('.black-overlay').css({'display':'block'});
        setTimeout(function() {
            $('.black-overlay').addClass('show');
        }, 50);
        setTimeout(function() {
            $('#ngForm input:text').first().focus();
        }, 1000);

        nodeBoxOpen = true;
    };

    venueGenerator.closeNodeBox = function() {
        $('input#age_p_t0').prop( 'disabled', false);
        $('.black-overlay').removeClass('show');
        $('.newVenueBox').removeClass('open');
        setTimeout(function() { // for some reason this doenst work without an empty setTimeout
            $('.black-overlay').css({'display':'none'});
        }, 300);
        nodeBoxOpen = false;
        $('#ngForm').trigger('reset');
        editing = false;
    };

    venueGenerator.destroy = function() {
        note.debug('Destroying venueGenerator.');
        // Event listeners
        $(window.document).off('keydown', keyPressHandler);
        $(window.document).off('click', '.cancel', cancelBtnHandler);
        $(window.document).off('click', '.add-button', venueGenerator.openNodeBox);
        $(window.document).off('click', '.delete-button', venueGenerator.removeFromList);
        $(window.document).off('click', '.inner-card', cardClickHandler);
        $(window.document).off('submit', '#ngForm', submitFormHandler);
        window.removeEventListener('changeStageStart', stageChangeHandler, false);
        $('.newVenueBox').remove();

    };

    venueGenerator.init = function(options) {
        window.tools.extend(venueGenerator.options, options);
        // $.extend(true, venueGenerator.options, options);
        // create elements
        var button = $('<span class="fa fa-4x fa-map-pin add-button"></span>');
        venueGenerator.options.targetEl.append(button);
        var venueCountBox = $('<div class="alter-count-box"></div>');
        venueGenerator.options.targetEl.append(venueCountBox);

        // create node box
        var newVenueBox = $('<div class="newVenueBox overlay"><form role="form" id="ngForm" class="form"><div class="col-sm-12"><h2 style="margin-top:0;margin-bottom:30px;"><span class="fa fa-map-pin"></span> Adding a Place</h2></div><div class="col-sm-12 fields"></div></form></div>');

        // venueGenerator.options.targetEl.append(newVenueBox);
        $('body').append(newVenueBox);
        $.each(venueGenerator.options.variables, function(index, value) {
            if(value.private !== true) {

                var formItem;

                switch(value.type) {
                    case 'text':
                    formItem = $('<div class="form-group '+value.variable+'"><label class="sr-only" for="'+value.variable+'">'+value.label+'</label><input type="text" class="form-control '+value.variable+'" id="'+value.variable+'" name="'+value.variable+'" placeholder="'+value.label+'"></div></div>');
                    break;

                    case 'autocomplete':
                    formItem = $('<div class="form-group ui-widget '+value.variable+'"><label class="sr-only" for="'+value.variable+'">'+value.label+'</label><input type="text" class="form-control '+value.variable+'" id="'+value.variable+'" name="'+value.variable+'" placeholder="'+value.label+'"></div></div>');
                    break;

                    case 'dropdown':

                    formItem = $('<div class="form-group '+value.variable+'" style="position:relative; z-index:9"><label for="'+value.variable+'">'+value.label+'</label><br /></div>');
                    var select = $('<select class="selectpicker" name="'+value.variable+'" />');
                    $.each(value.options, function(optionIndex, optionValue) {
                        $('<option/>').val(optionValue.value).text(optionValue.label).appendTo(select);
                    });

                    select.appendTo(formItem);

                    break;

                    case 'scale':
                    formItem = $('<div class="form-group '+value.variable+'"><label for="'+value.variable+'">'+value.label+'</label><br /></div>');

                    $.each(value.options, function(optionIndex, optionValue) {
                        $('<div class="btn-group big-check" data-toggle="buttons"><label class="btn"><input type="radio" name="'+value.variable+'" value="'+optionValue.value+'"><i class="fa fa-circle-o fa-3x"></i><i class="fa fa-check-circle-o fa-3x"></i> <span class="check-number">'+optionValue.label+'</span></label></div>').appendTo(formItem);
                    });

                    break;

                }

                $('.newVenueBox .form .fields').append(formItem);
                if (value.required === true) {
                    $('#'+value.variable).prop('required', true);
                }

                $('.selectpicker').selectpicker({
                    style: 'btn-info',
                    size: 4
                });

                $('#venue_name_t0').autocomplete({
                    source: window.netCanvas.Modules.session.protocolData.autocompleteVenues
                });

            }

        });

        var buttons = $('<div class="row"><div class="col-sm-4"><button type="submit" class="btn btn-success btn-block submit-1"><span class="glyphicon glyphicon-plus-sign"></span> Add</button></div><div class="col-sm-4"><button type="button" class="btn btn-danger btn-block delete-button"><span class="glyphicon glyphicon-trash"></span> Delete</button></div><div class="col-sm-4"><span class="btn btn-warning btn-block cancel">Cancel</span></div></div>');
        $('.newVenueBox .form .fields').append(buttons);

        newNodePanel = $('.newVenueBox').html();

        var nodeContainer = $('<div class="question-container"></div><div class="node-container-bottom-bg"></div>');
        venueGenerator.options.targetEl.append(nodeContainer);

        var title = $('<h1 class="text-center"></h1>').html(venueGenerator.options.heading);
        $('.question-container').append(title);
        var subtitle = $('<p class="lead text-center"></p>').html(venueGenerator.options.subheading);
        $('.question-container').append(subtitle);

        // create namelist container
        var nameList = $('<div class="node-container nameList"></div>');
        venueGenerator.options.targetEl.append(nameList);

        // Event listeners
        window.addEventListener('changeStageStart', stageChangeHandler, false);
        $(window.document).on('keydown', keyPressHandler);
        $(window.document).on('click', '.cancel', cancelBtnHandler);
        $(window.document).on('click', '.add-button', venueGenerator.openNodeBox);
        $(window.document).on('click', '.delete-button', venueGenerator.removeFromList);
        $(window.document).on('click', '.inner-card', cardClickHandler);
        $(window.document).on('submit', '#ngForm', submitFormHandler);

        // Set node count box
        var el = document.querySelector('.alter-count-box');

        venueCounter = new Odometer({
            el: el,
            value: venueCount,
            format: 'dd',
            theme: 'default'
        });

        // add existing nodes
        var edges = window.network.getEdges({type: 'Venue', from: window.network.getEgo().id, vg_t0:venueGenerator.options.variables[0].value});
        $.each(edges, function(index,value) {

            venueGenerator.addToList(value);
        });

        // Handle side panels
        if (venueGenerator.options.panels.length > 0) {
            // Side container
            var sideContainer = $('<div class="side-container"></div>');

            // Current side panel shows alters already elicited
            if (venueGenerator.options.panels.indexOf('current') !== -1) {
                // add custom node list
                sideContainer.append($('<div class="current-node-list node-lists"><h4>Places you already named:</h4></div>'));
                $('.nameList').addClass('alt');
                $.each(window.network.getEdges({type: 'Venue', from: window.network.getEgo().id}), function(index,value) {

                    var el = $('<div class="node-list-item">'+value.venue_name_t0+'</div>');
                    sideContainer.children('.current-node-list').append(el);
                });
            }

            venueGenerator.options.targetEl.append(sideContainer);

        } // end if panels
    };

    venueGenerator.addToList = function(properties) {
        note.debug('venueGenerator.addToList');
        note.trace(properties);
        // var index = $(this).data('index');
        var card;

        card = $('<div class="card"><div class="venue inner-card" data-index="'+properties.to+'"><h4>'+properties.venue_name_t0+'</h4></div></div>');
        $('.nameList').append(card);

    };

    venueGenerator.removeFromList = function() {
        $('.delete-button').hide();

        var nodeID = editing;

        window.network.removeNode(nodeID);

        $('div[data-index='+editing+']').addClass('delete');
        var tempEditing = editing;
        setTimeout(function() {
            $('div[data-index='+tempEditing+']').parent().remove();
        }, 700);

        editing = false;
        var venueCount = window.network.getNodes({type_t0: 'Venue'}).length;
        venueCounter.update(venueCount);

        venueGenerator.closeNodeBox();
    };

    return venueGenerator;
};
