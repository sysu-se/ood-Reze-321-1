1. 初始设计（Homework1）
在Homework1中，我实现了一个基础的数独领域模型，主要包含两个核心对象：
Sudoku（数独对象）
Game（游戏对象）
1.1 Sudoku对象
Sudoku负责表示当前数独盘面状态，其核心设计包括：
使用二维数组grid存储数据
提供以下接口：
getGrid()：获取当前棋盘（深拷贝）
guess({row, col, value})：填写数字
clone()：克隆当前对象
toJSON()：序列化
toString()：字符串表示
设计特点：
使用 deepCopy避免引用共享问题
所有修改都通过guess进行，保证封装性
在guess中加入contract check（类型检查、边界检查）
1.2 Game 对象
Game 用于管理游戏流程，其核心设计是：
使用 history 数组保存状态历史
使用 pointer 指向当前状态
提供接口：
getSudoku()：获取当前状态
guess()：进行一次操作（生成新状态）
undo() / redo()：回退与重做
canUndo() / canRedo()：状态判断
toJSON()：序列化
设计思想：
每一步操作都会 clone Sudoku，避免状态污染
通过 history.slice() 实现分支截断
使用指针实现时间回溯（类似版本控制）
1.3 Serialization（序列化）
为了支持状态保存与恢复，实现了：
createSudokuFromJSON
createGameFromJSON
设计思路：
JSON 只保存最小必要信息（grid / history / pointer）
通过工厂函数恢复对象行为
2. 存在的问题
在 Homework1 的实现中，存在一些不足：
2.1 功能较单一
只能进行基本填写
缺乏辅助功能（如提示）
2.2 缺乏探索机制
用户无法尝试“假设路径”
一旦走错只能手动 undo
2.3 UI 与领域逻辑完全分离
优点是解耦，但也带来：
UI 无法直接利用高级逻辑
需要额外适配层
3. 演化目标（Homework2）
在 Homework2 中，我的目标是：
增强 Sudoku 的能力（提示功能）
扩展 Game 的行为（探索模式）
保持原有接口不被破坏（兼容测试）
4. 演化内容
4.1 Hint 功能（提示）
在 Sudoku 中新增：
getCandidates(row, col)：计算候选数
getSingleCandidates()：寻找唯一候选
设计思路：
使用集合（Set）维护候选数字
排除：
行
列
3×3 宫格
这样可以找到“确定解”的位置，提高游戏体验。
4.2 Explore 模式（探索模式）
在 Game 中新增：
enterExplore()
abandonExplore()
commitExplore()
设计思路：
进入 explore 时保存一个快照（snapshot）
在 explore 中进行试探性操作
如果失败可以回滚
本质上类似：
“开一个分支 → 尝试 → 决定是否提交”
4.3 状态管理优化
保持 history + pointer 不变
explore 模式只是增加一层逻辑，不破坏原结构
5. 设计权衡
在演化过程中，我做了一些权衡：
5.1 保持接口稳定
优先保证：
Homework1 的测试全部通过
不修改原有函数签名
这样可以：
避免破坏已有功能
提高系统稳定性
5.2 功能与复杂度的平衡
虽然可以加入更多高级策略（如回溯搜索），但我选择：
只实现基础 hint（单候选）
保持实现简单可控
5.3 分层设计
最终形成结构：
Domain（index.js）：核心逻辑
UI（Svelte）：界面交互
两者通过接口交互，避免强耦合
6. 扩展性分析
当前设计具有良好的扩展能力：
易扩展部分：
Sudoku：
可增加更多解题策略
Game：
可增加计分、计时等机制
潜在问题：
history 会随着操作增长，占用内存
explore 模式复杂度增加，需谨慎维护
7. 总结
通过 Homework1 到 Homework2 的演化，我完成了从“基础数据结构”到“可交互游戏逻辑”的升级以及从“静态模型”到“支持探索与提示”的动态系统
这次实践让我理解了：
面向对象设计中“演化”的重要性
如何在不破坏原有系统的情况下扩展功能
如何在功能与复杂度之间做权衡
整体来看，这个设计是一个可扩展、可维护的数独领域模型。
