class card
  constructor: (@color, @type) ->

  id: ->
    if @color == 'red' or 'green' or 'yellow' or 'blue'
      @color + "" + @type
    else
      @type

  name: ->
    if @color == 'red' or 'green' or 'yellow' or 'blue'
      @color + "" + @type
    else
      @type


#number cards
createCards = (color) ->
  count = 0;
  while count <= 9
    new card(color, type)

colors = ['red', 'green', 'yellow', 'blue']
cards = createCards(color) for color in colors

console.log cards
