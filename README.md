# Framer HTTP Request Module

A [Framer](http://framerjs.com) module that makes it simple to create a Feed view where the user can scroll through and interact with different Card objects. 
The default Feed can have Cards added and removed.
The default Card object can have a primary response to being clicked and a secondary reponse when an overflow button is clicked 

The FeedComponent extends the ScrollComponent

## Installation

1. Grab `FeedComponent.coffee` from this repo's `/modules` directory
2. Put it into your Framer Studio project's  `/modules` directory. 
3. Then, in your Framer prototype, require the module with this line:

```coffeescript
FeedComponent = require "FeedComponent"
```
---

## Examples

#### [Basic Feed](https://framer.cloud/SjdUT)

Demonstrates a Feed with different sized cards, responding to tap and swipe events. 

---

## Usage

Simply put, the FeedComponent module adds Card objects to a ScrollComponent. Each card can respond to touch and swipe gestures based on individually specified callbacks and options. 


To create a Feed simply add:

```coffeescript

Feed = new FeedComponent
	# optional parameters
	spacing: 	** default: 10
	start_y:  	** default: 10
	
	# + all other ScrollComponent parameters


Feed.addItem(myCardLayer1, primaryAction, {id: 1, data: 'foo'})
Feed.addItem(myCardLayer2, primaryAction, {id: 2, data: 'foo'})
Feed.addItem(myCardLayer3, primaryAction, {id: 3, data: 'foo'})
Feed.addItem(myCardLayer3.copy(), primaryAction, {id: 4, data: 'foo'})

for card in Feed.items	
	Feed.addOverflowButtonToItem(card, optionsButtonLayer.copy(), showOptions)

```

Where primaryAction and showOptions are previoulsy defined as: 
```
primaryAction = (thisCard, theseOptions) ->
	# respond to a tap event on thisCard with theseOptions


showOptions = (thisCard, theseOptions) ->
	# respond to a tap on the overflowButton on thisCard with theseOptions

```

Available functions

```
addItem: (item, callback, options)

addOverflowButtonToItem: (chosenItem, button, callback)

hideItem: (chosenItem) ** default: called onSwipeLeft

unHideItem: (item, newIndex)
```


** swipe and tap events sometimes get confused. Framer still doesnt recognize event.stopPropagation()...



