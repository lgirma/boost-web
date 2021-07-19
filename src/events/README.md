# Events

Publish and subscribe to events

To create an event:

```javascript
import {AppEvent} from 'boost-web'

const myEvent = new AppEvent<MyEventData>()
```

To trigger the event

```javascript
myEvent.publish({x: 1, y})
```

To subscribe (listen) to the event:

```javascript
myEvent.subscribe(e => console.log('Got', e.x, e.y))
```