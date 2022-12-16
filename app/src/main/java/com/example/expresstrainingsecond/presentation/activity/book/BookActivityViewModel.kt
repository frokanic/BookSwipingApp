package com.example.expresstrainingsecond.presentation.activity.book

import android.content.Context
import androidx.lifecycle.ViewModel
import com.example.expresstrainingsecond.data.models.parserData.ManifestItem
import com.example.expresstrainingsecond.domain.models.SideMenuItem
import com.example.expresstrainingsecond.domain.models.WebViewItems
import com.example.expresstrainingsecond.domain.repository.BookRepository

class BookActivityViewModel(
    val bookRepository: BookRepository
): ViewModel() {

    fun getNonLinearSideMenuItems(context: Context?): MutableList<SideMenuItem> {
        val packageOpf = bookRepository.getPackageOpf(context)
        val listOfNonLinearSpineItems: MutableList<String> = mutableListOf()
        val listOfManifestItems: MutableList<ManifestItem> = mutableListOf()
        val listOfNonLinearItems: MutableList<SideMenuItem> = mutableListOf()

        packageOpf?.spine?.spine?.forEach {
            if (it.linear == "no") {
                listOfNonLinearSpineItems.add(it.idref)
            }
        }

        packageOpf?.manifest?.item?.forEach {
            listOfManifestItems.add(ManifestItem(it.id, it.properties, it.href, it.media_type, it.activityId, it.activityName, it.moduleId, it.moduleName, it.skillType))
        }

        listOfManifestItems.forEach {
            if (listOfNonLinearSpineItems.contains(it.id)) {
                listOfNonLinearItems.add(SideMenuItem(it.id, it.href, it.activityId))
            }
        }

        return listOfNonLinearItems

    }


    fun getLinearSideMenuItems(context: Context?): MutableList<SideMenuItem> {
        val packageOpf = bookRepository.getPackageOpf(context)
        val listOfLinearSpineItems: MutableList<String> = mutableListOf()
        val listOfManifestItems: MutableList<ManifestItem> = mutableListOf()
        val listOfTitles: MutableList<String?> = mutableListOf()
        val linearSideMenuItems: MutableList<SideMenuItem> = mutableListOf()


        packageOpf?.spine?.spine?.forEach {
            if (it.linear == "yes") {
                listOfLinearSpineItems.add(it.idref)
            }
        }

        packageOpf?.manifest?.item?.forEach {
            if (listOfLinearSpineItems.contains(it.id)) {
                listOfManifestItems.add(
                    ManifestItem(it.id, it.properties, it.href, it.media_type, it.activityId, it.activityName, it.moduleId, it.moduleName, it.skillType)
                )
            }
        }

        listOfTitles.add(listOfManifestItems[0].moduleName)
        listOfManifestItems.forEach {
            if (!listOfTitles.contains(it.moduleName)) {
                listOfTitles.add(it.moduleName)
            }
        }

        listOfManifestItems.forEach {
            if (listOfTitles.contains(it.moduleName)) {
                linearSideMenuItems.add(SideMenuItem(id = it.id, href = it.href, moduleName = it.moduleName))
                listOfTitles.remove(it.moduleName)
            }
            linearSideMenuItems.add(SideMenuItem(id = it.id, href = it.href, activityId = it.activityId, activityName = it.activityName, moduleId = it.moduleId, moduleName = it.moduleName))
        }

        return linearSideMenuItems
    }


    fun getNonLinearItems(context: Context?): MutableList<WebViewItems> {
        val packageOpf = bookRepository.getPackageOpf(context)
        val listOfNonLinearSpineItems: MutableList<String> = mutableListOf()
        val listOfManifestItems: MutableList<ManifestItem> = mutableListOf()
        val listOfNonLinearItems: MutableList<WebViewItems> = mutableListOf()


        packageOpf?.spine?.spine?.forEach {
            if (it.linear == "no") {
                listOfNonLinearSpineItems.add(it.idref)
            }
        }

        packageOpf?.manifest?.item?.forEach {
            listOfManifestItems.add(ManifestItem(it.id, it.properties, it.href, it.media_type, it.activityId, it.activityName, it.moduleId, it.moduleName, it.skillType))
        }

        listOfManifestItems.forEach {
            if (listOfNonLinearSpineItems.contains(it.id)) {
                listOfNonLinearItems.add(WebViewItems(it.id, it.href, it.activityId))
            }
        }

        return listOfNonLinearItems
    }


    fun getWebViewItems(context: Context?): MutableList<WebViewItems> {
        val packageOpf = bookRepository.getPackageOpf(context)
        val listOfLinearSpineItems: MutableList<String> = mutableListOf()
        val listOfManifestItems: MutableList<ManifestItem> = mutableListOf()
        val listOfWebViewItems: MutableList<WebViewItems> = mutableListOf()

        packageOpf?.spine?.spine?.forEach {
            if (it.linear == "yes") {
                listOfLinearSpineItems.add(it.idref)
            }
        }

        packageOpf?.manifest?.item?.forEach {
            listOfManifestItems.add(ManifestItem(it.id, it.properties, it.href, it.media_type, it.activityId, it.activityName, it.moduleId, it.moduleName, it.skillType))
        }

        listOfManifestItems.forEach {
            if (listOfLinearSpineItems.contains(it.id)) {
                listOfWebViewItems.add(WebViewItems(it.id, it.href, it.activityId))
            }
        }

        return listOfWebViewItems
    }

}

