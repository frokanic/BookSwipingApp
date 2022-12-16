package com.example.expresstrainingsecond.data.parser

import android.content.Context
import android.util.Log
import android.util.Xml
import com.example.expresstrainingsecond.data.models.parserData.ManifestItem
import com.example.expresstrainingsecond.data.models.parserData.PackageOpf
import com.example.expresstrainingsecond.data.models.parserData.Spine
import com.example.readerexpresspub.data.models.parserData.Manifest
import com.example.readerexpresspub.util.Constants.filePath
import org.xmlpull.v1.XmlPullParser
import java.io.InputStream


class XMLparser {

    companion object {
        val namespace: String? = null

        fun parseXml(context: Context?): PackageOpf? {
            val inputStream = loadXML(context)
            inputStream.use { inputStream ->
                val parser: XmlPullParser = Xml.newPullParser()
                parser.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, false)
                parser.setInput(inputStream, null)
                parser.nextTag()
                return readFeed(parser)
            }
        }


        private fun readFeed(parser: XmlPullParser): PackageOpf? {
            var manifest: Manifest? = null
            var spine: Spine? = null


            parser.require(XmlPullParser.START_TAG, namespace, "package")
            while (parser.next() != XmlPullParser.END_TAG) {
                if (parser.eventType != XmlPullParser.START_TAG) {
                    continue
                }
                // Starts by looking for the entry tag
                if (parser.name == "manifest") {
                    manifest = readManifest(parser)
                    //packageOpf = PackageOpf(readManifest(parser), null)
                } else if (parser.name == "spine") {
                    spine = XMLparserSpine.readSpine(parser)
                    //packageOpf = PackageOpf(null, XMLparserSpine.readSpine(parser))
                } else {
                    skip(parser)
                }
            }
            return PackageOpf(manifest, spine)
        }

        private fun readManifest(parser: XmlPullParser): Manifest {
            var manifest = arrayListOf<ManifestItem>()

            parser.require(XmlPullParser.START_TAG, namespace, "manifest")
            while (parser.next() != XmlPullParser.END_TAG) {
                if (parser.eventType != XmlPullParser.START_TAG) {
                    continue
                }
                // Starts by looking for the entry tag
                if (parser.name == "item") {
                    manifest.add(readItem(parser))
                } else {
                    skip(parser)
                }
            }
            return Manifest(manifest)
        }


        private fun readItem(parser: XmlPullParser): ManifestItem {
            var id = ""
            var properties = ""
            var href = ""
            var media_type = ""
            var activityId = ""
            var activityName = ""
            var moduleId = ""
            var moduleName = ""
            var skillType = ""

            parser.require(XmlPullParser.START_TAG, namespace, "item")
            val tag = parser.name
            if (tag == "item") {
                id = parser.getAttributeValue(null, "id")
                media_type = parser.getAttributeValue(null, "media-type")
                if (media_type == "application/xhtml+xml") {
                    properties = getSafeAttributeValue(parser.getAttributeValue(null, "properties"), parser)
                    href = parser.getAttributeValue(null, "href")
                    activityId = getSafeAttributeValue(parser.getAttributeValue(null, "activityId"), parser)
                    activityName = getSafeAttributeValue(parser.getAttributeValue(null, "activityName"), parser)
                    moduleId = getSafeAttributeValue(parser.getAttributeValue(null, "moduleId"), parser)
                    moduleName = getSafeAttributeValue(parser.getAttributeValue(null, "moduleName"), parser)
                    skillType = getSafeAttributeValue(parser.getAttributeValue(null, "skillType"), parser)
                }
                parser.nextTag()
            }
            parser.require(XmlPullParser.END_TAG, namespace, "item")
            return ManifestItem(id, properties, href, media_type, activityId, activityName, moduleId, moduleName, skillType)
        }

        private fun skip(parser: XmlPullParser) {
            if (parser.eventType != XmlPullParser.START_TAG) {
                throw IllegalStateException()
            }
            var depth = 1
            while (depth != 0) {
                when (parser.next()) {
                    XmlPullParser.END_TAG -> depth--
                    XmlPullParser.START_TAG -> depth++
                }
            }
        }


        fun loadXML(context: Context?): InputStream? {
            var input: InputStream? = null

            try {
                input = context?.assets?.open(filePath)
                var size = input!!.available()
                var buffer = ByteArray(size)

                var xmlData = String(buffer)      //Αχρηστο ισως

                return input
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
            Log.e("WTF", input.toString())
            return input
        }

        private fun getSafeAttributeValue(value: String?, parser: XmlPullParser): String {
            try {
                return value!!
            } catch (e: java.lang.Exception) {
                return ""
            }
        }

    }

}

