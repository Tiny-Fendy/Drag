// 工具箱
let utils = {

	// 遍历dom
	forEach(domList, fn) {
		for (let i = 0;i < domList.length;i++) {
			fn(domList[i], i);
		}
	},

	addClass(dom, className) {
		dom.className += ' ' + className;
	},

	removeClass(dom, className) {
		let reg = new RegExp(`\\s${className}|${className}`, 'g');
		dom.className = dom.className.replace(reg, '');
	},

	toggle(dom, className) {
		if (dom.className.match(className)) {
			this.removeClass(dom, className);
		} else {
			this.addClass(dom, className);
		}
	}
}

class Drag {
	constructor (options) {
		this.options = options || {};

		this.init = this.init.bind(this);
		this.setDragDrop = this.setDragDrop.bind(this);
		this.setParent = this.setParent.bind(this);
		this.setChild = this.setChild.bind(this);
		this.init();
	}

	init() {
		this.dWrap = document.getElementById(this.options.wrapper);
		this.dParents = document.getElementsByClassName(this.options.parent);
		this.dChildren = document.getElementsByClassName(this.options.child);
		this.setDragDrop();
	}

	setDragDrop () {
		this.dWrap.ondrop = ev => {
			ev.preventDefault();
			let node = document.getElementsByClassName('drag')[0];
			this.dWrap.appendChild(node);
			node.className = 'parent';
			this.setParent(node);
		}

		this.dWrap.ondragover = ev => {
			ev.preventDefault();
		}

		utils.forEach(this.dParents, dom => {
			dom.draggable = true;
			// console.log(dom.offsetTop);
			this.setParent(dom);
		});

		utils.forEach(this.dChildren, dom => {
			dom.draggable = true;
			this.setChild(dom);
		});
	}

	setParent(dom) {
		dom.onclick = () => {

		}

		dom.ondragstart = ev => {
			utils.addClass(ev.target, 'drag');
		}

		dom.ondrop = ev => {
			ev.stopPropagation();
			ev.preventDefault();
			let node = document.getElementsByClassName('drag')[0];

			if (!node.children.length) {
				dom.appendChild(node);
				node.className = 'child';

				// 初始化拖拽事件
				this.setChild(node);
			} else {
				utils.removeClass(node, 'drag');
			}
		}

		dom.ondragover = ev => {
			// console.log(ev.pageY, ev.offsetY);
			ev.stopPropagation();
			ev.preventDefault();
		}

		dom.ondragenter = ev => {
			console.log('parentEnter', ev);
		}
	}

	setChild(dom) {
		dom.ondragstart = ev => {
			ev.stopPropagation();
			utils.addClass(ev.target, 'drag');
		}
		dom.onclick = () => {

		}
		dom.ondrop = undefined;
		dom.ondragover = undefined;
		dom.ondragenter = undefined;
	}
}

window.Drag = Drag;