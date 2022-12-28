package com.example.expresstrainingsecond.presentation.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.viewModelScope
import com.example.expresstrainingsecond.R
import com.example.expresstrainingsecond.databinding.ActivityBookBinding
import com.example.expresstrainingsecond.databinding.FragmentSideMenuContentsBinding
import com.example.expresstrainingsecond.presentation.activity.book.BookActivityViewModel

class SideMenuContentsFragment : Fragment() {

    private lateinit var binding: FragmentSideMenuContentsBinding
    lateinit var viewModel: BookActivityViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSideMenuContentsBinding.inflate(inflater, container, false)
        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

    }


}