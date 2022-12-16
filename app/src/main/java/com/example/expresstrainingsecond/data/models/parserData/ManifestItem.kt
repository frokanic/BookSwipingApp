package com.example.expresstrainingsecond.data.models.parserData

data class ManifestItem(
    var id: String,
    var properties: String?,
    var href: String,
    var media_type: String?,
    var activityId: String? = null,
    var activityName: String? = null,
    var moduleId: String? = null,
    var moduleName: String? = null,
    var skillType: String? = null
)

