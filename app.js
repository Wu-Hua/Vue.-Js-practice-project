// 存取 localStorage 中的数据
let store = {
    save(key,value){    
        localStorage.setItem(key,JSON.stringify(value))
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key)) || []
    }
}

// let list = [
//     {
//         title: '任务名称11',
//         isChecked: false // 状态为 false ，为不选中
//     },
//     {
//         title: '任务名称22',
//         isChecked: true, // 状态为 true ，为选中
//     },
// ]

// 过滤的时候有三种情况 all finished unfinished
let filter = {
    all: function(list) {
        return list
    },
    finished: function(list) {
        return list.filter(function(item) {
            return item.isChecked;
        })
    },
    unfinished: function(list) {
        return list.filter(function(item) {
            return !item.isChecked;
        })
    }
}

let list = store.fetch('abc')



let app = new Vue({
    el: '.main',
    data: {
        list: list,
        todo: '',
        edtorTodos: '', // 记录正在编辑的数据
        beforeTitle: '', // 记录正在编辑的数据的title
        visibility: 'all' // 通过这个属性值的变化对数据进行筛选
    },
    watch: {
        // list: function() { // 监控 list 这个属性，当这个属性对应的值发生变化就会执行函数
        //     store.save('abc',this.list)
        // }
        list: { // 监控 list 这个属性，当这个属性对应的值发生变化就会执行函数，要进行深度复制
            handler: function() {
                store.save('abc',this.list)
            },
            deep: true
        }
    },
    computed: {
        unfinishedTaskNum(){
            return this.list.filter(item => {
                return !item.isChecked
            }).length
        },
        filteredList: function() {
            // 找到了过滤函数，就返回过滤后的数据；如果没有就返回所有数据
            return filter[this.visibility] ? filter[this.visibility](list) : this.list
        }
    },
    methods: {
        addTodo(data,e){ // 添加任务
            // 向 list 中添加一项任务
            // console.log(data)
            // console.log(e)
            // 事件处理函数中的 this 指向的是，当前这个根实例
            if(!this.todo) {
                return
            }
            this.list.push({
                title: this.todo,
                isChecked: false
            })
            this.todo = ''
        },
        deleteTodo(item) { // 删除任务
            let index = this.list.indexOf(item);
            this.list.splice(index,1);
        },
        edtorTodo(item) { // 编辑任务
            // 编辑任务的时候，先记录一下编辑这个任务的title，方便在取消编辑的时候重新赋值给title
            this.beforeTitle = item.title
            this.edtorTodos = item
        },
        edtorTodoEnd(item) { // 编辑任务成功
            this.edtorTodos = ''
        },
        cancelTodo(item) { // 取消编辑任务
            item.title = this.beforeTitle
            this.beforeTitle = ''
            this.edtorTodos = ''
        },
    },
    directives: {
        'focus':{
            // 指令的定义
            update: function (el,binding) {
                if(binding.value){
                    el.focus()
                }
            }
        }
    }
})

function watchHashChange() {
    var hash = window.location.hash.slice(1);
    app.visibility = hash
}

watchHashChange()

window.addEventListener('hashchange',watchHashChange)