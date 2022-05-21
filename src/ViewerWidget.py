from PyQt5.QtWidgets import QHBoxLayout, QWidget
from PCBView import PCBView

class ViewerWidget(QWidget):
    
    def __init__(self, parent=None):
        super().__init__(parent)

        layout = QHBoxLayout()

        self.leftView = PCBView.fromImageFile("example_images/pcb_front.JPG")
        self.rightView = PCBView.fromImageFile("example_images/pcb_back.JPG")

        layout.addWidget(self.leftView)
        layout.addWidget(self.rightView)

        self.setLayout(layout)

