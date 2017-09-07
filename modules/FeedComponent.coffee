class FeedComponent extends ScrollComponent
	constructor: (@options={}) ->
		@spacing = if @options.spacing then @options.spacing else 10
		@start_y =  if @options.start_y then @options.start_y else @spacing
		@nextItem_y = @start_y
		@items = if @options.items then @options.items else []
		
		super @options
		@.backgroundColor = if @options.backgroundColor then @options.backgroundColor else "#FFFFFF"
		@.scrollHorizontal = false
		@.name =  if @options.name then @options.name else 'FeedComponent'
		@.size = if @options.size then @options.size else Screen.size
		@.content.width = Screen.width


		if @items 
			@positionItems()
			for item in @items
				@addItemListeners(item)
				item.states = 
					deleted:
						height: 0
						# might want to animate Y as well
						animationOptions:
							curve: Spring(damping: 0.5)
							time: 1.5
						
	@define 'items',
		get: ->
			@options.items
		set: (value) ->
			@options.items = value
			
	@define 'spacing',
		get: ->
			@options.spacing
		set: (value) ->
			@options.spacing = value
			
	@define 'nextItem_y',
		get: ->
			@options.nextItem_y
		set: (value) ->
			@options.nextItem_y = value
			
	@define 'start_y',
		get: ->
			@options.start_y
		set: (value) ->
			@options.start_y = value
	
	addItem: (item, callback, options) ->
		item.x = 0
		item.parent = @.content
		item.options = options
		item.centerX()
		item.y = @.nextItem_y
		@.items.push(item)
		@.nextItem_y += item.height + @.spacing
		
		item.states = 
			deleted:
				height: 0
				# might want to animate Y as well
				animationOptions:
					curve: Spring(damping: 0.5)
					time: 1.5
					
		item.onTapEnd ->
			if item.parent.parent.isDragging is false
				if callback
					callback(item, options)
			
		@addItemListeners(item)
		@addShadowToItem(item)
		

	addItemListeners: (item) ->			
		that = @
		item.onSwipeLeftEnd ->
			that.hideItem(this)

		# sanity check that touch was recognized
		item.onTapStart ->
			animateTap = new Animation item,
				scale: 1.02
				animationOptions:
					curve: Spring(damping: 0.5)
					time: .01
					
			animateTap.start()
 
			animateTap.once Events.AnimationEnd, ->
				animateTap.reverse().start()
	

	addOverflowButtonToItem: (chosenItem, button, callback) ->
		itemIndex = @.items.indexOf(chosenItem)

		if itemIndex == -1 
			return

		item = @.items[itemIndex]
		item = chosenItem

		button.x = 0
		button.parent = item.parent
		button.y = item.y
		button.x = item.x + item.width - button.width

		button.bringToFront()

		button.on Events.Tap, (e) ->
			callback(item, item.options)

		button.states = 
			deleted:
				opacity: 0


		item.button = button
		
	
	addShadowToItem: (item) ->
		item.shadowY = 2
		item.shadowBlur = 5 
		item.shadowColor = "rgba(131, 140, 199, .1)" 

				
	hideItem: (chosenItem) ->
		itemIndex = @.items.indexOf(chosenItem)
		@.items.splice(itemIndex, 1)
		chosenItem.animate('deleted')
		if chosenItem.button
			chosenItem.button.animate('deleted')

		@.positionItems()


	unHideItem: (item, index) ->

		@.items.splice(index, 0, item)		
		item.stateSwitch('default')
		if item.button
			item.button.stateSwitch('default')
		
		@positionItems()

	positionItems: ->
		@nextItem_y = @start_y 	
		for item in @items
			item.x = 0
			item.parent = @.content
			item.centerX()
			item.animate 
				y : @nextItem_y

			item.once Events.AnimationEnd, ->
				if item.button
					item.button.y = item.y

			if item.button
				item.button.animate
					y : @nextItem_y
				
			@nextItem_y += item.height + @spacing

module.exports = FeedComponent