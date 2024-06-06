class MyClass:
    # 类属性
    class_attribute = "I am a class attribute"

    def __init__(self, value):
        # 实例属性
        self.instance_attribute = value

    @classmethod
    def setCA(cls, value):
        cls.class_attribute = value

# 访问类属性
print(MyClass.class_attribute)  # 输出: I am a class attribute

# 修改类属性
MyClass.class_attribute = "New class attribute value"
print(MyClass.class_attribute)  # 输出: New class attribute value

# 创建实例
instance = MyClass("I am an instance attribute")

# 访问实例属性
print(instance.instance_attribute)  # 输出: I am an instance attribute

# 访问类属性（通过实例）
print(instance.class_attribute)  # 输出: New class attribute value

# 修改类属性（通过实例，不推荐）
# instance.class_attribute = "Modified through instance"
instance.setCA("Modified")
print(MyClass.class_attribute)  # 输出: Modified through instance
