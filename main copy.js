// ========== دوال التخزين ==========
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== صفحة إضافة مهمة ==========
const taskForm = document.getElementById('taskForm');
if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جلب البيانات
        const task = {
            id: Date.now(),
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value,
            priority: document.getElementById('priority').value,
            status: 'قيد الانتظار'
        };
        
        // حفظ المهمة
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        
        // رسالة نجاح
        const msg = document.getElementById('message');
        msg.textContent = ' تم حفظ المهمة بنجاح!';
        msg.className = 'message show';
        
        // مسح النموذج
        taskForm.reset();
        
        // إخفاء الرسالة
        setTimeout(() => {
            msg.className = 'message';
        }, 3000);
    });
}

// ========== صفحة عرض المهام ==========
function showTasks(filter = 'all') {
    const container = document.getElementById('tasksContainer');
    if (!container) return;
    
    let tasks = getTasks();
    const searchTerm = document.getElementById('searchInput')?.value || '';
    
    // تصفية حسب البحث
    if (searchTerm) {
        tasks = tasks.filter(task => 
            task.title.includes(searchTerm) || 
            task.description.includes(searchTerm)
        );
    }
    
    // تصفية حسب الحالة
    if (filter !== 'all') {
        tasks = tasks.filter(task => task.status === filter);
    }
    
    // ترتيب المهام
    tasks.sort((a, b) => b.id - a.id);
    
    // عرض المهام
    if (tasks.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#666;">لا توجد مهام</p>';
        return;
    }
    
    let html = '';
    tasks.forEach(task => {
        const completedClass = task.status === 'مكتملة' ? 'completed' : '';
        const statusBtn = task.status === 'مكتملة' ? 'إعادة' : 'إكمال';
        
        html += `
            <div class="task-card priority-${task.priority} ${completedClass}">
                <h3>${task.title}</h3>
                <p> ${task.description || 'لا يوجد وصف'}</p>
                <p> ${task.date} |  ${task.priority} |  ${task.status}</p>
                <div class="actions">
                    <button onclick="toggleStatus(${task.id})" class="btn-complete">
                        ${statusBtn}
                    </button>
                    <button onclick="editTask(${task.id})" class="btn-edit">
                        تعديل
                    </button>
                    <button onclick="deleteTask(${task.id})" class="btn-delete">
                        حذف
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// تحميل المهام عند فتح الصفحة
if (document.getElementById('tasksContainer')) {
    showTasks();
}

// البحث المباشر
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', () => showTasks());
}

// تغيير حالة المهمة
function toggleStatus(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'مكتملة' ? 'قيد الانتظار' : 'مكتملة';
        saveTasks(tasks);
        showTasks();
    }
}

// حذف مهمة
function deleteTask(id) {
    if (confirm('هل تريد حذف هذه المهمة؟')) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(tasks);
        showTasks();
    }
}

// الذهاب لصفحة التعديل
function editTask(id) {
    window.location.href = `edit-task.html?id=${id}`;
}

// ========== صفحة تعديل مهمة ==========
const editForm = document.getElementById('editForm');
if (editForm) {
    // جلب id من الرابط
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    
    // تحميل بيانات المهمة
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        document.getElementById('taskId').value = task.id;
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('date').value = task.date;
        document.getElementById('priority').value = task.priority;
        document.getElementById('status').value = task.status;
    }
    
    // حفظ التعديلات
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tasks = getTasks();
        const index = tasks.findIndex(t => t.id === id);
        
        if (index !== -1) {
            tasks[index].title = document.getElementById('title').value;
            tasks[index].description = document.getElementById('description').value;
            tasks[index].date = document.getElementById('date').value;
            tasks[index].priority = document.getElementById('priority').value;
            tasks[index].status = document.getElementById('status').value;
            
            saveTasks(tasks);
            
            const msg = document.getElementById('message');
            msg.textContent = ' تم تحديث المهمة بنجاح!';
            msg.className = 'message show';
            
            setTimeout(() => {
                window.location.href = 'tasks.html';
            }, 1500);
        }
    });
}

// ========== صفحة الإحصائيات ==========
if (document.getElementById('totalTasks')) {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'مكتملة').length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completionRate').textContent = rate + '%';
}


window.addEventListener("load",()=>{
    document.body.style.opacity="0";
    setTimeout(()=>{
        document.body.style.opacity="1";
        document.body.style.transition = "0.5s";
    },150)
})


document.querySelectorAll("button").forEach(n=>{
    n.addEventListener("click",function(){
        n.style.transform="scale(.6)";
        setTimeout(()=>{
                    n.style.transform="scale(1)";

        },100)
 })}
);

// رسالة توضيحية عند النقر على زر الحفظ
let but=document.querySelector(".btn1");
but.addEventListener("click",()=>
    confirm("هل تريد الحفظ")
);
//  من اغلاق الصفحة
window.addEventListener("beforeunload",function(event){
event.preventDefault();
event.returnValue="true";
});



