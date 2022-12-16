package com.example.expresstrainingsecond.domain.repository

import android.content.Context
import com.example.expresstrainingsecond.data.models.parserData.PackageOpf
import com.example.expresstrainingsecond.data.parser.XMLparser

class BookRepository {

    fun getPackageOpf(context: Context?): PackageOpf? {
        return XMLparser.parseXml(context)
    }

}