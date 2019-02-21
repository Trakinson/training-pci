define(['IMSGlobal/jquery_2_1_1', 'qtiCustomInteractionContext', 'OAT/util/event','OAT/util/html','barChartInteraction/runtime/amcharts/serial',"barChartInteraction/runtime/amcharts/light"], function($, qtiCustomInteractionContext, events, html, SerialJs, LightJs){
    

    var barChartInteraction = {
        
        /**
         * Custom Interaction Hook API: id
         */
        id : -1,

        /**
         * 
         */
        chartdiv: 'barChart',
        chart: null,
        
        /**
         * Custom Interaction Hook API: getTypeIdentifier
         * 
         * A unique identifier allowing custom interactions to be identified within an item.
         * 
         * @returns {String} The unique identifier of this PCI Hook implementation.
         */
        getTypeIdentifier : function(){
            return 'barChartInteraction';
        },

        loadScript: function(url, callback)
        {
            // Adding the script tag to the head as suggested before
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        },
        
        /**
         * 
         * 
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function(id, dom, config){
            var me = this;
            me.chartdiv='barChart_'+id;
            var css = '#'+me.chartdiv+' {width : 110px; height : 300px; font-size : 11px;}	amcharts-graph-bullet {cursor: ns-resize;}',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');
        
            style.type = 'text/css';
            if (style.styleSheet){
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
             style.appendChild(document.createTextNode(css));
            }
            
            head.appendChild(style);
            
            
            //add method on(), off() and trigger() to the current object
            events.addEventMgr(me);
            
            // Register the value for the 'id' attribute of this Custom Interaction Hook instance.
            // We consider in this proposal that the 'id' attribute 
            me.id = id;
            
            //dom.id=me.chartdiv;
            me.dom = dom;
            var bC=$(dom).find('.barChart');
            bC[0].id=me.chartdiv;
            me.config = config || {};

            //var canvas = $(this.dom).find('.liquids')[0];
            //me.loadScript('barChartInteraction/runtime/amcharts/amcharts.js',me.loadScript('barChartInteraction/runtime/amcharts/serial.js',me.loadScript('barChartInteraction/runtime/amcharts/amcharts.js',me._createChart())));
            

            // Tell the rendering engine that I am ready.
            // Please note that in this proposal, we consider the 'id' attribute to be part of the
            // Custom Interaction Hood API. The Global Context will then inspect the 'id' attribute
            // to know which instance of the PCI hook is requesting a service to be achieved.
            qtiCustomInteractionContext.notifyReady(me);
            me._createChart();
            this.$container = $(dom);
            html.render(this.$container.find('.prompt'));
            // Bind events
            /*$(canvas).on('click', function(e) {
                var rect = canvas.getBoundingClientRect();
                
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                
                if (self._isCoordInLiquidContainer(x, y) === true) {
                    self._clearCanvas();
                    self._drawLiquidContainer(y);
                    self._updateResponse(y);
                    
                    //communicate the response change to the interaction
                    self.trigger('responsechange', [self.getResponse()]);
                }
            });*/
        },
        
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @param {Integer} response
         */
        setResponse : function(response){
            //var y = this._yFromResponse(response);
            
            //this._clearCanvas();
            this._updateChart(response.base.integer);
            this._updateResponse(response.base.integer);
        },
        
        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         * 
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse : function(){
            return this._currentResponse;
        },
        
        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         * 
         * @param {Object} interaction
         */
        resetResponse : function(){
            //this._clearCanvas();
            this._updateChart();
            this._currentResponse = { base: null };
        },
        
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains 
         * Event listeners are removed and the state and the response are reset
         * 
         * @param {Object} interaction
         */
        destroy : function(){

            var $container = $(this.dom);
            $container.find('.barChart').off();
        },
        
        /**
         * Restore the state of the interaction from the serializedState.
         * 
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function(state){

        },
        
        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         * 
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState : function(){
            return {};
        },
        
        _currentResponse: { base : null },
        _callbacks: [],
        
        _createChart : function(y) {
            
            var me = this;
            var hg;
            if (typeof y !== 'undefined')
            {
                hg = y;
            } else {
                hg = 50;
            }
            var chart = this.chart;
            chart = AmCharts.makeChart(me.chartdiv, {
                "type": "serial",
                "theme": "light",
                "width": 110,
                "height": 300,
                "categoryField": "col",
                "rotate": false,
                "startDuration": 1,
                "categoryAxis": {
                    "gridPosition": "start",
                    "position": "bottom"
                },
                "trendLines": [],
                "graphs": [
                    {
                        //"balloonText": "Income:[[value]]",
                        "showBalloon": false,
                        "fillAlphas": 0.8,
                        "id": "AmGraph-1",
                        "lineAlpha": 0.2,
                        //"title": "Income",
                        "type": "column",
                        "valueField": "income",
                        "colorField": "color",
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "bulletSize": 5,
                    }
                ],
                "chartCursor": {
                    "pan": false,
                    "zoomable": false,
                    //"valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 0.2,
                    "valueLineAlpha": 0.2,
                    "forceShow": true
                },
                "guides": [],
                "valueAxes": [
                    {
                        "id": "ValueAxis-1",
                        "position": "left",
                        "axisAlpha": 0,
                        "maximum":100,
                        "minimum":0
                    }
                ],
                "allLabels": [],
                "balloon": false,
                "titles": [],
                "dataProvider": [
                    {
                        "col": '1',
                        "income": hg,
                        "color": "#85C5E3"
                    }
                ],
                "export": {
                    "enabled": false
                 }
    
            });
            chart.addListener("changed", function(event) {
                var ddt = {
                    data: event.chart.dataProvider[event.index],
                    index: event.index
                }
                chart.cursorDataContext = ddt;
              });
            chart.addListener("rendered", function(event) {
                event.chart.chartDiv.addEventListener('click', function(even) {
                    updatePosition(chart.cursorDataContext);
                });
                
                
              /**
               * ChartCursor and its value line must be enabled for this to work
               */
              if (chart.chartCursor === undefined ||
                  chart.chartCursor.valueLineAxis === undefined)
                return;
              
              /**
               * Add generic mouse events
               */
              /*chart.mouseIsDown = false;
              chart.mouseTimeout;
              document.body.onmousedown = function() { 
                chart.mouseIsDown = true;
              }
              document.body.onmouseup = function() {
                chart.mouseIsDown = false;
              }
              document.body.onmousemove = function() {
                if (!chart.mouseIsDown)
                  return;
                if (chart.mouseTimeout)
                  clearTimeout(chart.mouseTimeout);
                chart.mouseTimeout = setTimeout(function() {
                  updatePosition();
                }, 1);
              }*/
              
              /**
               * Add click event for plot area
               */
              function updatePosition(ddt) {
                // click outside plot area
                if (chart.chartCursor.index === undefined || chart.chartCursor.index === "NaN" || ddt.index == undefined)
                  return;
                
                // get index of the category clicked
                var index = ddt.index;
                
                // get value clicked
                var value = chart.chartCursor.valueLineAxis.coordinateToValue(chart.chartCursor.vLine.y);
                
                // round the value
                value = Math.round(value);
                // update data
                if (value >= chart.valueAxes[0].minimum && value <= chart.valueAxes[0].maximum && index != 'undefined'){
                    chart.dataProvider[index][chart.graphs[0].valueField] = value;
                    me._updateResponse(value);
                    chart.validateData();
                }
                
              };
              
            });
            chart.validateNow();
            me.chart = chart;
        },

        _updateChart: function(y){
            var value;
            if (typeof y !== 'undefined' && typeof y === 'number')
            {
                value = y;
            } else {
                value = 50;
            }
            var me = this;
            var chart = me.chart;
            chart.dataProvider[0][chart.graphs[0].valueField] = value;
            chart.validateData();
        },
        
        _updateResponse : function(y) {
            this._currentResponse = { base: { integer: y } };
            this.trigger('responsechange', [this.getResponse()]);
        }
    };

    qtiCustomInteractionContext.register(barChartInteraction);
});