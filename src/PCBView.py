from PyQt5.QtWidgets import QGraphicsRectItem, QGraphicsView, QGraphicsScene
from PyQt5.QtCore import QRectF, Qt
from PyQt5.QtGui import QImage, QPixmap, QResizeEvent, QMouseEvent


class PCBView(QGraphicsView):

    # === Constructors ==============================================
    
    def __init__(self, parent=None):
        super().__init__(parent)

    @staticmethod
    def fromImageFile(file, parent=None):
        """
        Get a QGraphicsView with an image loaded
        inside from the given file. 

        :param file: The path to the image to load. 
        :returns: The QGraphicsView with the image inside. 
        """
        image = QImage(file)
        view = PCBView(parent)
        scene = QGraphicsScene()

        scene.addPixmap(QPixmap.fromImage(image))
        scene.setSceneRect(QRectF(image.rect()))

        view.setScene(scene)

        return view

    # === Event Handlers ============================================

    def resizeEvent(self, e: QResizeEvent):
        super().resizeEvent(e)

        self.fitInView(
            QRectF(self.sceneRect()), 
            Qt.AspectRatioMode.KeepAspectRatio
        )

    def mouseReleaseEvent(self, event: QMouseEvent) -> None:
        super().mouseReleaseEvent(event)

        sceneCoords = self.mapToScene(event.localPos().toPoint())

        item = QGraphicsRectItem(
            sceneCoords.x() - 50,
            sceneCoords.y() - 50,
            100,
            100
        )

        self.scene().addItem(item)

