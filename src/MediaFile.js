/**
 * representation of VAST <MediaFile> element
 */
var MediaFile = function(data) {

    /** either “progressive” for progressive download protocols (such as HTTP) or “streaming” for streaming protocols. */
    this.delivery = null;

    /** MIME type for the file container. Popular MIME types include, but are not limited to “video/xflv” for Flash Video and “video/mp4” for MP4 */
    this.type = null;

    /** the native width of the video file, in pixels */
    this.width = 0;

    /** the native height of the video file, in pixels */
    this.height = 0;

    /** [optional] an identifier for the media file */
    this.id = null;

    /** [optional] for progressive load video, the bitrate value specifies the average bitrate for the media file */
    this.bitrate = 0;

    /** [optional] the minBitrate and maxBitrate can be used together to specify the minimum and maximum bitrates for streaming videos */
    this.minBitrate = 0;
    this.maxBitrate = 0;

    /** [optional] identifies whether the media file is meant to scale to larger dimensions */
    this.scalable = true;

    /** a Boolean value that indicates whether aspect ratio for media file dimensions should be maintained when scaled to new dimensions */
    this.maintainAspectRatio = true;

    /** identifies the API needed to execute an interactive media file */
    this.apiFramework = null;

    /** path to advert file */
    this.file = data.textContent;

    for (var i = 0; i < data.attributes.length; i++) {

        var name = data.attributes.item(i).nodeName;
        var value = data.attributes.item(i).nodeValue;

        switch (name.toLowerCase()) {

            case "id":
                this.id = value;
                break;

            case "delivery":
                this.delivery = value;
                break;

            case "type":
                this.type = value;
                break;

            case "bitrate":
                this.bitrate = parseInt(value) || 0;
                break;

            case "minbitrate":
                this.minBitrate = value;
                break;

            case "maxbitrate":
                this.maxBitrate = value;
                break;

            case "width":
                this.width = parseInt(value);
                break;

            case "height":
                this.height = parseInt(value);
                break;

            case "scalable":
                this.scalable = (value == "true");
                break;

            case "maintainaspectratio":
                this.maintainAspectRatio = (value == "true");
                break;

            case "apiframework":
                this.apiFramework = value;
                break;
        }
    }
};
