package com.example.expresstrainingsecond.presentation.activity.book

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.expresstrainingsecond.domain.repository.BookRepository

class BookActivityViewModelProviderFactory(
    val bookRepository: BookRepository
): ViewModelProvider.Factory {

    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return BookActivityViewModel(bookRepository) as T
    }
}