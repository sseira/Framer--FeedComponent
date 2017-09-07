# Import file "Feed_assets"
sketch = Framer.Importer.load("imported/Feed_assets@1x", scale: 1)
Utils.globalLayers(sketch)

FeedComponent = require "FeedComponent"

MainFlow = new FlowComponent

Feed = new FeedComponent
# 	parent: HomeParentLayer.content
	size: Screen.size
	name: 'Feed'
	spacing: 9	
	backgroundColor: 'rgb(249,249,249)'
	
	
primaryAction = (card, options)->
	nextPage = new Layer
		frame: Screen.frame
		backgroundColor: options.color
		name: options.title
		
	title = new TextLayer
		text: options.title
		color: 'white'
		parent: nextPage	
	title.centerX()
	title.centerY()
	
	nextPage.onClick ->
		MainFlow.showPrevious()
		Utils.delay 1, ->
			nextPage.destroy()
	MainFlow.showNext(nextPage)
	
	
showOptions = (card, options) ->
	MainFlow.showOverlayBottom(Overflow_actions)
	console.log options.title
	Feed.scrollToPoint(
		y: card.y - 10
		true
		curve: Bezier.ease
	)
		
Feed.addItem(Blue_card.copy(), primaryAction, {color: '#338ED7', title: 'Blue Page'})
Feed.addItem(Gray_card.copy(), primaryAction, {color: '#5E6978', title: 'Gray Page'})
Feed.addItem(Yellow_card.copy(), primaryAction, {color: '#FBB034', title: 'Yellow Page'})
Feed.addItem(News_card.copy(), primaryAction, {color: '#111', title: 'News Page'})

Feed.addItem(Blue_card.copy(), primaryAction, {color: '#338ED7', title: 'Blue Page'})
Feed.addItem(Gray_card.copy(), primaryAction, {color: '#5E6978', title: 'Gray Page'})
Feed.addItem(Yellow_card.copy(), primaryAction, {color: '#FBB034', title: 'Yellow Page'})

for card in Feed.items	
	Feed.addOverflowButtonToItem(card, Overflow_button.copy(), showOptions)




MainFlow.showNext(Feed)