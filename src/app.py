from PyQt5.QtWidgets import QApplication, QMainWindow
from ViewerWidget import ViewerWidget
import sys


def main(argv):
    app = QApplication(argv)

    window = QMainWindow()
    window.setCentralWidget(ViewerWidget())
    window.show()

    app.exec()


if __name__ == "__main__":
    main(sys.argv)
