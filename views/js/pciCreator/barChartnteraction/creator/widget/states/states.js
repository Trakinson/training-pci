define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/states/states',
    'barChartInteraction/creator/widget/states/Question',
    'barChartInteraction/creator/widget/states/Answer',
    'barChartInteraction/creator/widget/states/Correct'
], function(factory, states){
    return factory.createBundle(states, arguments, ['map']);
});