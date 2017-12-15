function $(selector) {
	if (typeof selector === 'string') {
		return Array.from(document.querySelectorAll(selector));
	} else {
		return Array.from(selector);
	}
}

// 工具箱
let utils = {
	hasClass(dom, className) {
		return dom && dom.className.indexOf(className) >= 0;
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
	},

	appendByIndex(parents, node, index) {
		if (parents.children.length === index + 1) {
			parents.appendChild(node);
		} else if (node.isSameNode(parents.children[index - 1])) {
			parents.insertBefore(node, parents.children[index + 1]);
		} else {
			parents.insertBefore(node, parents.children[index]);
		}
	}
}

class Drag {
	constructor (options) {
		this.options = options || {};
		this.overNode = null; //当前经过的节点
		this.curNode = null; //当前被选中的节点

		this.init = this.init.bind(this);
		this.setDragDrop = this.setDragDrop.bind(this);
		this.setParent = this.setParent.bind(this);
		this.setChild = this.setChild.bind(this);
		this.init();
	}

	init() {
		this.$wrap = $('#' + this.options.wrapper)[0];
		this.$parents = $('.' + this.options.parent);
		this.$children = $('.' + this.options.child);
		this.setDragDrop();
	}

	setDragDrop () {
		this.$wrap.ondragover = ev => {
			ev.preventDefault();
		};

		this.$wrap.ondragenter = ev => {
			ev.preventDefault();

			let index = $(this.$wrap.children).indexOf(this.overNode);
			utils.appendByIndex(this.$wrap, this.curNode, index);
		}

		this.$parents.forEach(dom => {
			dom.draggable = true;
			this.setParent(dom);
		});

		this.$children.forEach(dom => {
			dom.draggable = true;
			this.setChild(dom);
		});
	}

	setParent(dom) {
		dom.className = this.options.parent;
		dom.ondragstart = ev => {
			ev.stopPropagation();
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
			this.curNode = ev.target;
		};

		dom.ondragenter = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			let target = ev.target;

			this.overNode = target;
			if (target.isSameNode(this.curNode)) {
				return;
			}
			if (this.curNode.getElementsByClassName('child').length) {
				utils.appendByIndex(this.$wrap, this.curNode, $('.parent').indexOf(target));
			} else if (!target.getElementsByClassName('child').length) {
				dom.querySelector('.children').appendChild(this.curNode);
			}
		};

		dom.ondragover = ev => {
			ev.preventDefault();
		};

		dom.ondragend = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			this.curNode.style.backgroundColor = '';
			utils.removeClass(this.curNode, 'drag');
			if (utils.hasClass(this.curNode.parentNode.parentNode, 'parent')) {
				this.setChild(this.curNode);
			}
		}
	}

	setChild(dom) {
		dom.className = this.options.child;

		dom.ondragstart = ev => {
			ev.stopPropagation();
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
			this.curNode = ev.target;
		};

		dom.ondragenter = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			if (this.curNode.getElementsByClassName('child').length || dom.isSameNode(this.curNode)) {
				return false;
			}
			let parentNode = dom.parentNode;
			let index = $(parentNode.getElementsByClassName('child')).indexOf(dom);
			utils.appendByIndex(parentNode, this.curNode, index);
		};

		dom.ondragend = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			this.curNode.style.backgroundColor = '';
			utils.removeClass(this.curNode, 'drag');
			if (!utils.hasClass(this.curNode.parentNode.parentNode, 'parent')) {
				this.setParent(this.curNode);
			}
		}

		dom.ondragover = undefined;
	}
}

window.Drag = Drag;