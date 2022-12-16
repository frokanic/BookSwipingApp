package com.example.expresstrainingsecond.data.parser

import com.example.expresstrainingsecond.data.models.parserData.Spine
import com.example.expresstrainingsecond.data.models.parserData.SpineItem
import org.xmlpull.v1.XmlPullParser


class XMLparserSpine {

    companion object {
        private val namespace: String? = null



        fun readSpine(parser: XmlPullParser): Spine {
            var spine = arrayListOf<SpineItem>()

            parser.require(XmlPullParser.START_TAG, XMLparser.namespace, "spine")
            while (parser.next() != XmlPullParser.END_TAG) {
                if (parser.eventType != XmlPullParser.START_TAG) {
                    continue
                }
                // Starts by looking for the entry tag
                if (parser.name == "itemref") {
                    spine.add(readItemref(parser))
                } else {
                    skip(parser)
                }
            }
            return Spine(spine)

        }

        private fun readItemref(parser: XmlPullParser): SpineItem {
            var itemRef = ""
            var linear = ""
            parser.require(XmlPullParser.START_TAG, namespace, "itemref")
            val tag = parser.name
            if (tag == "itemref") {
                itemRef = parser.getAttributeValue(null, "idref")
                linear = parser.getAttributeValue(null, "linear")
                parser.nextTag()
            }
            parser.require(XmlPullParser.END_TAG, namespace, "itemref")
            return SpineItem(itemRef, linear)
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
    }
}


































/*
fun readItemrefList(parser: XmlPullParser): ArrayList<String> {
            var itemRef = ""
            var itemRefList = arrayListOf("")
            parser.require(XmlPullParser.START_TAG, namespace, "itemref")
            val tag = parser.name
            if (tag == "itemref") {
                itemRef = parser.getAttributeValue(null, "idref")
                itemRefList.add(itemRef)
                parser.nextTag()
            }
            parser.require(XmlPullParser.END_TAG, namespace, "itemref")
            return itemRefList
        }
 */


