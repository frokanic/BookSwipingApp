package com.example.expresstrainingsecond.domain.models

data class SideMenuItem(
    var id: String,
    var href: String,
    var activityId: String? = null,
    var activityName: String? = null,
    var moduleId: String? = null,
    var moduleName: String? = null
)
