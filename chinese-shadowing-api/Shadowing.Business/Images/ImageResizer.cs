using System.Drawing;
using System.Drawing.Drawing2D;

namespace Shadowing.Business.Images
{
    public class ImageResizer
    {
        public Bitmap ResizeImage(Image image, int width, int height)
        {
            var sourceWidth = image.Width;
            var sourceHeight = image.Height;

            var targetSize = new Size(width, height);

            var nPercentW = (float)targetSize.Width / sourceWidth;
            var nPercentH = (float)targetSize.Height / sourceHeight;
            var nPercent = nPercentH < nPercentW ? nPercentH : nPercentW;

            var destWidth = (int)(sourceWidth * nPercent);
            var destHeight = (int)(sourceHeight * nPercent);

            var bitmap = new Bitmap(destWidth, destHeight);
            using var graphics = Graphics.FromImage(bitmap);
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.DrawImage(image, 0, 0, destWidth, destHeight);
            graphics.Dispose();

            return bitmap;
        }
    }
}
