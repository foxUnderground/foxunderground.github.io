$(() => {
	const engine = Matter.Engine.create();  
	engine.gravity.y = 0
	engine.gravity.x = 0
	const box = {
	  body: Matter.Bodies.rectangle($('#basketball').position().left, $('#basketball').position().top, $('#basketball').width()*3, $('#basketball').height()*3),
	  elem: document.querySelector("#basketball"),
	  render() {
	    const {x, y} = this.body.position;
	    this.elem.style.top = `${y}px`;
	    this.elem.style.left = `${x}px`;
	    this.elem.style.transform = `rotate(${this.body.angle}rad)`;
	  },
	};
	box.render()
	const ground = Matter.Bodies.rectangle(
	  0, window.innerHeight*1.7, 10000, 1000, {isStatic: true}
	);
	const left = Matter.Bodies.rectangle(
	  0, 0, 50, 10000, {isStatic: true}
	);
	const right = Matter.Bodies.rectangle(
	  window.innerWidth/10*9, 0, 1000, 1000, {isStatic: true}
	);

	const mouseConstraint = Matter.MouseConstraint.create(
	  engine, {element: document.body}
	);
	Matter.Composite.add(
	  engine.world, [box.body, ground, left, right, mouseConstraint]
	);
	(function rerender() {
	  box.render();
	  Matter.Engine.update(engine);
	  requestAnimationFrame(rerender);
	})();
$('#basketball').on('mousedown',  () => {
	event.preventDefault()
	console.log('qnedlerkjflekjdsnkrndrfnlçn')
	engine.gravity.y = 5
})
})