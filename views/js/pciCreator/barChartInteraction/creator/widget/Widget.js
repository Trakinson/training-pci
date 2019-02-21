define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'barChartInteraction/creator/widget/states/states'
], function(Widget, states){

    var BarChartInteractionWidget = Widget.clone();

    BarChartInteractionWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return BarChartInteractionWidget;
});